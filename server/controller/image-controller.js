import grid from 'gridfs-stream';
import mongoose from 'mongoose';


const url = process.env.BASE_URL || 'http://localhost:8000'

let gridfsBucketPhotos, gridfsBucketFs;
const conn = mongoose.connection;
conn.once('open', () => {
    gridfsBucketPhotos = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'photos'
    });
    gridfsBucketFs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'fs'
    });
    grid(conn.db, mongoose.mongo);
});

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Le immagini caricate dal form finiscono nel bucket "photos"; i file più
// vecchi possono essere nel bucket "fs". Cerchiamo prima "photos" perché è il
// caso più frequente, evitando una query in più per ogni immagine.
const getBuckets = () => ([
    { name: 'photos', bucket: gridfsBucketPhotos },
    { name: 'fs', bucket: gridfsBucketFs }
]);

const findImageFile = async (filename) => {
    const buckets = getBuckets();
    const escaped = escapeRegex(filename);

    for (const { name, bucket } of buckets) {
        const file = await conn.db.collection(`${name}.files`).findOne({ filename });
        if (file) return { file, bucket };
    }

    for (const { name, bucket } of buckets) {
        const files = await conn.db
            .collection(`${name}.files`)
            .find({ filename: { $regex: escaped } })
            .toArray();
        if (files.length > 0) return { file: files[0], bucket };
    }

    const baseName = escapeRegex(filename.split('.')[0]);
    for (const { name, bucket } of buckets) {
        const files = await conn.db
            .collection(`${name}.files`)
            .find({ filename: { $regex: baseName } })
            .toArray();
        if (files.length > 0) return { file: files[0], bucket };
    }

    return null;
};

export const uploadImage = (request, response) => {
    if(!request.file) 
        return response.status(404).json("File not found");
    
    const imageUrl = `${url}/file/${request.file.filename}`;

    response.status(200).json(imageUrl);    
}

export const getImage = async (request, response) => {
    try {
        const result = await findImageFile(request.params.filename);

        if (!result) {
            return response.status(404).json({ msg: 'File not found' });
        }

        const { file, bucket } = result;

        if (!bucket) {
            return response.status(503).json({ msg: 'Storage not ready' });
        }

        response.set('Content-Type', file.contentType || 'application/octet-stream');
        if (file.length) {
            response.set('Content-Length', String(file.length));
        }
        // Il nome del file contiene un timestamp e non viene riutilizzato:
        // il contenuto può restare nella cache del browser per un anno.
        response.set('Cache-Control', 'public, max-age=31536000, immutable');

        const readStream = bucket.openDownloadStream(file._id);
        readStream.on('error', () => {
            if (!response.headersSent) {
                response.status(404).json({ msg: 'File not found' });
            } else {
                response.destroy();
            }
        });
        readStream.pipe(response);
    } catch (error) {
        if (!response.headersSent) {
            response.status(500).json({ msg: error.message });
        }
    }
}
