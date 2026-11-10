import { useEffect, useState } from 'react';

import { Box, Button, LinearProgress, Typography } from '@mui/material';
import { useSearchParams } from 'react-router-dom';

import { API } from '../../../service/api';

// components
import Post from './Post';
import PostSkeleton from './PostSkeleton';

const CACHE_PREFIX = 'zen-posts';
const CACHE_VERSION = 1;
const CACHE_MAX_POSTS = 60;

const visuallyHidden = {
    position: 'absolute',
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: 'hidden',
    clip: 'rect(0 0 0 0)',
    whiteSpace: 'nowrap',
    border: 0
};

const getCacheKey = (category) =>
    `${CACHE_PREFIX}:v${CACHE_VERSION}:${category || 'all'}`;

const readCache = (category) => {
    try {
        const raw = localStorage.getItem(getCacheKey(category));
        if (!raw) return null;

        const parsed = JSON.parse(raw);
        return Array.isArray(parsed?.posts) ? parsed.posts : null;
    } catch (error) {
        // Storage non disponibile o contenuto corrotto: si riparte dalla rete.
        return null;
    }
};

const writeCache = (category, posts) => {
    try {
        localStorage.setItem(
            getCacheKey(category),
            JSON.stringify({
                savedAt: Date.now(),
                posts: posts.slice(0, CACHE_MAX_POSTS)
            })
        );
    } catch (error) {
        // Storage pieno o non disponibile: la cache è solo un'ottimizzazione.
    }
};

const PostsGrid = ({ children }) => (
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
        {children}
    </Box>
);

const PostsContent = ({ category }) => {
    // Legge la cache già al primo render: chi torna sul sito vede subito i post
    // salvati, senza un lampo di skeleton.
    const [initialCache] = useState(() => readCache(category));

    const [posts, setPosts] = useState(initialCache || []);
    const [phase, setPhase] = useState(initialCache?.length ? 'refreshing' : 'loading');
    const [error, setError] = useState('');
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let cancelled = false;
        const cachedPosts = readCache(category);

        if (cachedPosts?.length) {
            setPosts(cachedPosts);
            setPhase('refreshing');
        } else {
            setPosts([]);
            setPhase('loading');
        }
        setError('');

        const fetchData = async () => {
            try {
                const response = await API.getAllPosts({ category: category || '' });
                if (cancelled) return;

                if (response?.isSuccess) {
                    const data = Array.isArray(response.data) ? response.data : [];
                    setPosts(data);
                    writeCache(category, data);
                    setPhase('ready');
                } else {
                    setError('Impossibile aggiornare i contenuti.');
                    setPhase(cachedPosts?.length ? 'ready' : 'error');
                }
            } catch (requestError) {
                if (cancelled) return;

                setError('Impossibile caricare i contenuti.');
                setPhase(cachedPosts?.length ? 'ready' : 'error');
            }
        };

        fetchData();

        return () => {
            cancelled = true;
        };
    }, [category, reloadKey]);

    if (phase === 'loading') {
        return (
            <Box role="status" aria-live="polite" aria-busy="true">
                <Box component="span" sx={visuallyHidden}>
                    Caricamento contenuti in corso
                </Box>
                <PostsGrid>
                    {Array.from({ length: 6 }).map((_, index) => (
                        <PostSkeleton key={index} />
                    ))}
                </PostsGrid>
            </Box>
        );
    }

    if (phase === 'error') {
        return (
            <Box
                role="alert"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: 2,
                    margin: '30px 80px'
                }}
            >
                <Typography sx={{ color: 'text.secondary', fontSize: 18 }}>
                    {error}
                </Typography>
                <Button
                    variant="outlined"
                    onClick={() => setReloadKey((key) => key + 1)}
                >
                    Riprova
                </Button>
            </Box>
        );
    }

    return (
        <>
            {phase === 'refreshing' && (
                <LinearProgress sx={{ mb: 1, borderRadius: 1 }} />
            )}
            {error && (
                <Typography sx={{ color: 'text.secondary', fontSize: 14, mb: 1 }}>
                    {error} Vengono mostrati i contenuti salvati.
                </Typography>
            )}
            {posts.length ? (
                <PostsGrid>
                    {posts.map((post) => (
                        <Box
                            key={post._id}
                            sx={{ display: 'block', minWidth: 0, height: '100%' }}
                        >
                            <Post post={post} />
                        </Box>
                    ))}
                </PostsGrid>
            ) : (
                <Box sx={{ color: 'text.secondary', margin: '30px 80px', fontSize: 18 }}>
                    No data is available for selected category
                </Box>
            )}
        </>
    );
};

const Posts = () => {
    const [searchParams] = useSearchParams();
    const category = searchParams.get('category');

    // I post vengono rimontati al cambio categoria: così cache e skeleton
    // corrispondono subito al filtro selezionato.
    return <PostsContent key={category || 'all'} category={category} />;
};

export default Posts;
