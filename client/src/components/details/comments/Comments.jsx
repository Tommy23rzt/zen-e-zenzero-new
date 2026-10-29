import { useState, useEffect, useContext } from 'react';
import { Box, TextareaAutosize, Button, Typography, styled } from '@mui/material';
import { Link } from 'react-router-dom';

import { DataContext } from '../../../context/DataProvider';

import { API } from '../../../service/api';

//components
import Comment from './Comment';

const Container = styled(Box)`
    margin-top: 100px;
    display: flex;
`;

const Image = styled('img')({
    width: 50,
    height: 50,
    borderRadius: '50%'
});

const StyledTextArea = styled(TextareaAutosize)(({ theme }) => ({
    height: '100px !important',
    width: '100%',
    margin: '0 20px',
    padding: 8,
    background: theme.palette.background.paper,
    color: theme.palette.text.primary,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 4,
    fontFamily: 'inherit',
    fontSize: 16,
    resize: 'vertical',
    '&::placeholder': {
        color: theme.palette.text.secondary,
        opacity: 1
    },
    '&:focus-visible': {
        outline: `2px solid ${theme.palette.primary.main}`,
        outlineOffset: 1
    }
}));

const initialValue = {
    name: '',
    postId: '',
    date: new Date(),
    comments: ''
}

const Comments = ({ post }) => {
    const url = 'https://static.thenounproject.com/png/12017-200.png'

    const [comment, setComment] = useState(initialValue);
    const [comments, setComments] = useState([]);
    const [toggle, setToggle] = useState(false);

    const { account } = useContext(DataContext);

    useEffect(() => {
        if (!post?._id) {
            return;
        }
        const getData = async () => {
            const response = await API.getAllComments(post._id);
            if (response.isSuccess) {
                setComments(response.data);
            }
        }
        getData();
    }, [toggle, post]);

    const handleChange = (e) => {
        setComment({
            ...comment,
            name: account.username,
            postId: post._id,
            comments: e.target.value
        });
    }

    const addComment = async() => {
        await API.newComment(comment);
        setComment(initialValue)
        setToggle(prev => !prev);
    }
    
    return (
        <Box>
            {account?.username ? (
                <Container>
                    <Image src={url} alt="dp" />   
                    <StyledTextArea 
                        minRows={5}
                        placeholder="what's on your mind?"
                        onChange={(e) => handleChange(e)} 
                        value={comment.comments}
                    />
                    <Button 
                        variant="contained" 
                        color="primary" 
                        size="medium" 
                        style={{ height: 40 }}
                        onClick={(e) => addComment(e)}
                    >Post</Button>             
                </Container>
            ) : (
                <Container>
                    <Typography sx={{ margin: '0 auto' }}>
                        <Link to="/login">Accedi</Link> per lasciare un commento.
                    </Typography>
                </Container>
            )}
            <Box>
                {
                    comments && comments.length > 0 && comments.map(comment => (
                        <Comment comment={comment} setToggle={setToggle} />
                    ))
                }
            </Box>
        </Box>
    )
}

export default Comments;