import { Box, Skeleton, styled, alpha } from '@mui/material';

const Card = styled(Box)(({ theme }) => {
    const isDark = theme.palette.mode === 'dark';

    return {
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
        boxShadow: isDark
            ? '0 1px 2px rgba(0, 0, 0, 0.5), 0 18px 40px -24px rgba(0, 0, 0, 0.9)'
            : '0 1px 2px rgba(16, 24, 40, 0.05), 0 16px 36px -20px rgba(16, 24, 40, 0.22)'
    };
});

const Content = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    flexGrow: 1,
    padding: '18px 20px 20px'
});

const Footer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    marginTop: 'auto',
    borderTop: `1px solid ${alpha(theme.palette.divider, 0.8)}`
}));

const PostSkeleton = () => (
    <Card aria-hidden="true">
        <Skeleton variant="rectangular" height={172} animation="wave" />
        <Content>
            <Skeleton variant="text" width="92%" height={30} animation="wave" />
            <Skeleton variant="text" width="64%" height={30} animation="wave" />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                <Skeleton variant="circular" width={28} height={28} animation="wave" />
                <Skeleton variant="text" width="40%" height={20} animation="wave" />
            </Box>
            <Skeleton variant="text" width="100%" height={20} animation="wave" />
            <Skeleton variant="text" width="96%" height={20} animation="wave" />
            <Skeleton variant="text" width="70%" height={20} animation="wave" />
            <Footer>
                <Skeleton variant="text" width={70} height={20} animation="wave" />
            </Footer>
        </Content>
    </Card>
);

export default PostSkeleton;
