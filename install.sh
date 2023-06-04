yum groupinstall -y "Development tools"
yum install -y gcc-c++ cairo-devel pango-devel python3-devel libjpeg-turbo-devel wget

pnpm install canvas --build-from-source

if [ -n VERCEL_URL ]; then
    echo "BASE_URL=https://$VERCEL_URL" >> .env
fi