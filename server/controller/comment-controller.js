
import Comment from '../model/comment.js';


export const newComment = async (request, response) => {
    try {
        const comment = await new Comment(request.body);
        await comment.save();

        response.status(200).json('Comment saved successfully');
    } catch (error) {
        console.error(error);
        response.status(500).json({ msg: 'Error while saving comment' });
    }
}


export const getComments = async (request, response) => {
    try {
        const comments = await Comment.find({ postId: request.params.id });
        
        response.status(200).json(comments);
    } catch (error) {
        console.error(error);
        response.status(500).json({ msg: 'Error while fetching comments' });
    }
}

export const deleteComment = async (request, response) => {
    try {
        const comment = await Comment.findById(request.params.id);
        if (!comment) {
            return response.status(404).json({ msg: 'Comment not found' })
        }

        if (comment.name !== request.user.username && comment.name !== request.user.name) {
            return response.status(403).json({ msg: 'Not authorized to delete this comment' })
        }

        await comment.delete()

        response.status(200).json({ msg: 'comment deleted successfully' });
    } catch (error) {
        console.error(error);
        response.status(500).json({ msg: 'Error while deleting comment' })
    }
}