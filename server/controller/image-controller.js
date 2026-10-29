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



export const uploadImage = (request, response) => {
    if(!request.file) 
        return response.status(404).json("File not found");
    
    const imageUrl = `${url}/file/${request.file.filename}`;

    response.status(200).json(imageUrl);    
}

export const getImage = async (request, response) => {
    try {   
        let file = await conn.db.collection('fs.files').findOne({ filename: request.params.filename });
        let bucket = gridfsBucketFs;

        if (!file) {
            file = await conn.db.collection('photos.files').findOne({ filename: request.params.filename });
            bucket = gridfsBucketPhotos;
        }

        if (!file) {
            let files = await conn.db.collection('fs.files').find({ filename: { $regex: request.params.filename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') } }).toArray();
            if (files.length > 0) {
                file = files[0];
                bucket = gridfsBucketFs;
            } else {
                let files2 = await conn.db.collection('photos.files').find({ filename: { $regex: request.params.filename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') } }).toArray();
                if (files2.length > 0) {
                    file = files2[0];
                    bucket = gridfsBucketPhotos;
                }
            }
        }

        if (!file) {
            let files = await conn.db.collection('fs.files').find({ filename: { $regex: request.params.filename.split('.')[0] } }).toArray();
            if (files.length > 0) {
                file = files[0];
                bucket = gridfsBucketFs;
            } else {
                let files2 = await conn.db.collection('photos.files').find({ filename: { $regex: request.params.filename.split('.')[0] } }).toArray();
                if (files2.length > 0) {
                    file = files2[0];
                    bucket = gridfsBucketPhotos;
                }
            }
        }

        if (!file) {
            return response.status(404).json({ msg: 'File not found' });
        }

        response.set('Content-Type', file.contentType || 'application/octet-stream');

        const readStream = bucket.openDownloadStream(file._id);
        readStream.on('error', () => {
            if (!response.headersSent) {
                response.status(404).json({ msg: 'File not found' });
            }
        });
        readStream.pipe(response);
    } catch (error) {
        if (!response.headersSent) {
            response.status(500).json({ msg: error.message });
        }
    }
}