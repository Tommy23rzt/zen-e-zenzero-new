
import Post from '../model/post.js';


export const createPost = async (request, response) => {
    try {
        const { title, description, picture, categories } = request.body;

        if (!title || !description) {
            return response.status(400).json({ msg: 'Title and description are required' });
        }

        const post = new Post({
            title: title.trim(),
            description: description.trim(),
            picture: picture || '',
            username: request.user.username,
            categories: categories || 'All',
            createdDate: new Date()
        });
        await post.save();

        response.status(200).json('Post saved successfully');
    } catch (error) {
        console.error(error);
        response.status(500).json({ msg: 'Error while creating post' });
    }
}

export const updatePost = async (request, response) => {
    try {
        const post = await Post.findById(request.params.id);

        if (!post) {
            return response.status(404).json({ msg: 'Post not found' })
        }

        if (post.username !== request.user.username) {
            return response.status(403).json({ msg: 'Not authorized to update this post' })
        }

        const { title, description, picture, categories } = request.body;
        const updateData = {};
        if (title !== undefined) updateData.title = title.trim();
        if (description !== undefined) updateData.description = description.trim();
        if (picture !== undefined) updateData.picture = picture;
        if (categories !== undefined) updateData.categories = categories;
        
        await Post.findByIdAndUpdate(request.params.id, { $set: updateData })

        response.status(200).json('post updated successfully');
    } catch (error) {
        console.error(error);
        response.status(500).json({ msg: 'Error while updating post' });
    }
}

export const deletePost = async (request, response) => {
    try {
        const post = await Post.findById(request.params.id);
        
        if (!post) {
            return response.status(404).json({ msg: 'Post not found' })
        }

        if (post.username !== request.user.username) {
            return response.status(403).json({ msg: 'Not authorized to delete this post' })
        }

        await post.delete()

        response.status(200).json('post deleted successfully');
    } catch (error) {
        console.error(error);
        response.status(500).json({ msg: 'Error while deleting post' })
    }
}

export const getPost = async (request, response) => {
    try {
        const post = await Post.findById(request.params.id);

        response.status(200).json(post);
    } catch (error) {
        response.status(500).json(error)
    }
}

export const getAllPosts = async (request, response) => {
    let username = request.query.username;
    let category = request.query.category;
    let page = request.query.page ? parseInt(request.query.page) : null;
    let limit = request.query.limit ? parseInt(request.query.limit) : null;

    if (typeof username !== 'string') username = undefined;
    if (typeof category !== 'string') category = undefined;

    let query = {};
    if (username) query.username = username.trim();
    if (category && category !== '') query.categories = category.trim();

    try {
        if (page || limit) {
            if (!page || isNaN(page)) page = 1;
            if (!limit || isNaN(limit)) limit = 10;
            if (limit > 50) limit = 50;
            if (page < 1) page = 1;
            const skip = (page - 1) * limit;
            const posts = await Post.find(query).sort({ createdDate: -1 }).skip(skip).limit(limit);
            const total = await Post.countDocuments(query);
            return response.status(200).json({
                posts,
                total,
                page,
                pages: Math.ceil(total / limit)
            });
        }

        const posts = await Post.find(query).sort({ createdDate: -1 });
        return response.status(200).json(posts);
    } catch (error) {
        console.error(error);
        response.status(500).json({ msg: 'Error while fetching posts' })
    }
}