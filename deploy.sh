echo "Building app..."
npm run build

echo "Deploy files to server..."
scp -r dist/* root@14.225.192.15:/var/www/html/

ssh root@14.225.192.15 <<EOF
# Tạo thư mục nếu chưa có
sudo mkdir -p /var/www/html

# Set quyền cho web server
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html

# Reload nginx
sudo systemctl reload nginx
echo "Frontend deployed successfully"
EOF

echo "Done!"