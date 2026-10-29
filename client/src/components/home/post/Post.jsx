import { styled, Box, Typography, alpha } from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { Link } from 'react-router-dom';

const CARD_FONT = "'Cinzel', 'Times New Roman', serif";

const Card = styled(Box)(({ theme }) => {
    const isDark = theme.palette.mode === 'dark';

    return {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 380,
        overflow: 'hidden',
        borderRadius: 24,
        border: '1px solid',
        borderColor: isDark
            ? alpha(theme.palette.common.white, 0.08)
            : alpha(theme.palette.divider, 0.9),
        backgroundColor: theme.palette.background.paper,
        backgroundImage: isDark
            ? `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.02)} 0%, transparent 45%)`
            : `linear-gradient(180deg, transparent 55%, ${alpha(theme.palette.primary.main, 0.035)} 100%)`,
        boxShadow: isDark
            ? '0 1px 2px rgba(0, 0, 0, 0.5), 0 18px 40px -24px rgba(0, 0, 0, 0.9)'
            : '0 1px 2px rgba(16, 24, 40, 0.05), 0 16px 36px -20px rgba(16, 24, 40, 0.22)',
        transition: 'transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.35s ease, border-color 0.35s ease',
        '&:hover': {
            transform: 'translateY(-6px)',
            borderColor: alpha(theme.palette.primary.main, 0.4),
            boxShadow: isDark
                ? `0 2px 4px rgba(0, 0, 0, 0.45), 0 28px 56px -24px ${alpha(theme.palette.primary.main, 0.55)}`
                : `0 2px 4px rgba(16, 24, 40, 0.06), 0 28px 56px -24px ${alpha(theme.palette.primary.main, 0.45)}`,
            '& img': {
                transform: 'scale(1.06)'
            },
            '& .card-arrow': {
                transform: 'translateX(3px)'
            }
        },
        '@media (prefers-reduced-motion: reduce)': {
            transition: 'none',
            '&:hover': {
                transform: 'none',
                '& img': {
                    transform: 'none'
                },
                '& .card-arrow': {
                    transform: 'none'
                }
            }
        }
    };
});

const ImageWrapper = styled(Box)({
    position: 'relative',
    width: '100%',
    height: 172,
    flexShrink: 0,
    overflow: 'hidden'
});

const Image = styled('img')({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    transition: 'transform 0.65s cubic-bezier(0.2, 0.8, 0.2, 1)'
});

const ImageOverlay = styled(Box)({
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.55) 100%)',
    pointerEvents: 'none'
});

const CategoryChip = styled(Typography)(({ theme }) => ({
    position: 'absolute',
    left: 16,
    bottom: 14,
    maxWidth: 'calc(100% - 32px)',
    padding: '6px 12px',
    borderRadius: 999,
    border: `1px solid ${alpha(theme.palette.common.white, 0.22)}`,
    backgroundColor: alpha(theme.palette.common.black, 0.45),
    backdropFilter: 'blur(10px)',
    color: theme.palette.common.white,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
}));

const Content = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    gap: 12,
    padding: '18px 20px 20px'
});

const Heading = styled(Typography)(({ theme }) => ({
    fontFamily: CARD_FONT,
    fontSize: 19,
    fontWeight: 700,
    lineHeight: 1.3,
    letterSpacing: '-0.01em',
    color: theme.palette.text.primary,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    overflowWrap: 'anywhere',
    minHeight: '2.6em'
}));

const AuthorRow = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    gap: 8
});

const AvatarBadge = styled(Box)(({ theme }) => ({
    width: 28,
    height: 28,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.22 : 0.1),
    color: theme.palette.primary.main,
    fontSize: 12,
    fontWeight: 700,
    flexShrink: 0
}));

const AuthorName = styled(Typography)(({ theme }) => ({
    fontSize: 13,
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
}));

const Details = styled(Typography)(({ theme }) => ({
    fontSize: 14,
    lineHeight: 1.6,
    color: theme.palette.text.secondary,
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    overflowWrap: 'anywhere',
    flexGrow: 1
}));

const Footer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTop: `1px solid ${alpha(theme.palette.divider, 0.8)}`
}));

const ReadMore = styled(Typography)(({ theme }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: theme.palette.primary.main
}));

const Post = ({ post }) => {
    const url = post.picture ? post.picture : 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=752&q=80';
    const initial = post.username ? post.username.charAt(0).toUpperCase() : '?';

    return (
        <Card component={Link} to={`details/${post._id}`} sx={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
            <ImageWrapper>
                <Image src={url} alt={post.title || 'post'} loading="lazy" decoding="async" />
                <ImageOverlay />
                {post.categories && <CategoryChip>{typeof post.categories === 'string' ? decodeURIComponent(post.categories) : post.categories}</CategoryChip>}
            </ImageWrapper>
            <Content>
                <Heading>{post.title}</Heading>
                <AuthorRow>
                    <AvatarBadge>{initial}</AvatarBadge>
                    <AuthorName>{post.username || 'Anonimo'}</AuthorName>
                </AuthorRow>
                <Details>{post.description}</Details>
                <Footer>
                    <ReadMore>
                        Leggi
                        <ArrowForwardRoundedIcon className="card-arrow" sx={{ fontSize: 16, transition: 'transform 0.3s ease' }} />
                    </ReadMore>
                </Footer>
            </Content>
        </Card>
    );
};

export default Post;
