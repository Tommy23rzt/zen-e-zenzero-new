import { useEffect, useState } from 'react';

import { Box } from '@mui/material';
import { useSearchParams } from 'react-router-dom';

// import { getAllPosts } from '../../../service/api';
import { API } from '../../../service/api';

//components
import Post from './Post';

const Posts = () => {
    const [posts, getPosts] = useState([]);
    
    const [searchParams] = useSearchParams();
    const category = searchParams.get('category');

    useEffect(() => {
        const fetchData = async () => { 
            let response = await API.getAllPosts({ category : category || '' });
            if (response.isSuccess) {
                getPosts(response.data);
            }
        }
        fetchData();
    }, [category]);

    return (
        <>
            {
                posts?.length ? (
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                sm: 'repeat(2, minmax(0, 1fr))',
                                md: 'repeat(3, minmax(0, 1fr))'
                            },
                            gap: 2,
                            width: '100%',
                            p: 1
                        }}
                    >
                        {posts.map(post => (
                            <Box
                                key={post._id}
                                sx={{ display: 'block', minWidth: 0, height: '100%' }}
                            >
                                <Post post={post} />
                            </Box>
                        ))}
                    </Box>
                ) : <Box sx={{ color: 'text.secondary', margin: '30px 80px', fontSize: 18 }}>
                        No data is available for selected category
                    </Box>
            }
        </>
    )
}

export default Posts;