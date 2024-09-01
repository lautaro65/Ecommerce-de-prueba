/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                port: '',
                pathname: '/djnpyyl6b/image/upload/**', // Ajusta este pathname según la ruta de tus imágenes
            },],
    },
};

export default nextConfig;
