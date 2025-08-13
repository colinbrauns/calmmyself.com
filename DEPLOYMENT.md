# Deployment Setup

This document outlines the setup required for automated deployment to GitHub Pages and Linode.

## Prerequisites

- GitHub repository with Actions enabled
- Linode server with SSH access
- Web server (nginx/apache) configured on Linode

## GitHub Secrets Configuration

Configure these secrets in your GitHub repository settings (`Settings > Secrets and variables > Actions`):

### Required Secrets

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `LINODE_SSH_PRIVATE_KEY` | SSH private key for Linode server access | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `LINODE_HOST` | Linode server IP or hostname | `192.168.1.100` or `myserver.com` |
| `LINODE_USER` | SSH username for Linode server | `deploy` or `ubuntu` |

### Optional Variables

| Variable Name | Description | Default |
|---------------|-------------|---------|
| `LINODE_DEPLOYMENT_URL` | URL for health checks after deployment | `https://yourdomain.com` |

## SSH Key Setup

### 1. Generate SSH Key Pair (if not exists)

```bash
ssh-keygen -t rsa -b 4096 -C "github-actions@calmmyself.com"
```

### 2. Add Public Key to Linode Server

```bash
# On your Linode server
mkdir -p ~/.ssh
echo "your-public-key-content" >> ~/.ssh/authorized_keys
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

### 3. Add Private Key to GitHub Secrets

Copy the private key content to the `LINODE_SSH_PRIVATE_KEY` secret in GitHub.

## Linode Server Setup

### Web Server Configuration

#### Nginx Configuration Example

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;
    
    root /var/www/calmmyself;
    index index.html;
    
    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none';" always;
    
    location / {
        try_files $uri $uri/ $uri.html =404;
    }
    
    # Caching for static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

#### Apache Configuration Example

```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    ServerAlias www.yourdomain.com
    DocumentRoot /var/www/calmmyself
    
    <Directory /var/www/calmmyself>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        
        # Try files in order
        FallbackResource /index.html
    </Directory>
    
    # Security headers
    Header always set X-Frame-Options "DENY"
    Header always set X-Content-Type-Options "nosniff"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none';"
    
    # Caching for static assets
    <FilesMatch "\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$">
        ExpiresActive On
        ExpiresDefault "access plus 1 year"
    </FilesMatch>
</VirtualHost>
```

### Directory Permissions

```bash
# Create deployment directory
sudo mkdir -p /var/www/calmmyself
sudo chown -R www-data:www-data /var/www/calmmyself
sudo chmod -R 755 /var/www/calmmyself

# Ensure deploy user can write to directory
sudo usermod -a -G www-data deploy
```

## Deployment Process

The GitHub Actions workflow will:

1. **Security Scan**: Run npm audit, lint, typecheck, and tests
2. **Build**: Create static export of Next.js application
3. **Deploy to GitHub Pages**: Automatic deployment on main branch
4. **Deploy to Linode**: Upload via SSH and extract to web root
5. **Health Check**: Verify deployment accessibility
6. **Backup Management**: Keep last 5 deployment backups

## Environment-Specific Configuration

### GitHub Pages

- Automatically configured when pushing to `main` branch
- Serves from `gh-pages` branch or GitHub Actions
- URL: `https://username.github.io/repository-name`

### Linode Production

- Manual server setup required
- Custom domain configuration
- SSL certificate setup (recommended: Let's Encrypt)

## SSL Certificate Setup (Recommended)

### Using Certbot (Let's Encrypt)

```bash
# Install certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx  # or python3-certbot-apache

# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

## Monitoring and Alerts

Consider setting up:

- **Uptime monitoring**: UptimeRobot, Pingdom, or StatusCake
- **Error tracking**: Sentry or similar service
- **Performance monitoring**: Google PageSpeed Insights API
- **Security monitoring**: GitHub security alerts

## Troubleshooting

### Common Issues

1. **SSH Connection Failed**
   - Verify SSH key is correctly added to GitHub secrets
   - Check SSH key permissions on server
   - Verify firewall settings

2. **Web Server Not Reloading**
   - Check web server configuration syntax
   - Verify deploy user has sudo permissions for service reload
   - Check server logs: `sudo journalctl -u nginx` or `sudo journalctl -u apache2`

3. **Health Check Failing**
   - Verify `LINODE_DEPLOYMENT_URL` is correct
   - Check DNS propagation
   - Verify web server is serving files correctly

4. **Permission Errors**
   - Ensure deploy user is in www-data group
   - Verify directory permissions are correct
   - Check SELinux settings (if applicable)

### Useful Commands

```bash
# Check deployment status
systemctl status nginx  # or apache2

# View recent logs
sudo tail -f /var/log/nginx/error.log  # or /var/log/apache2/error.log

# Test web server configuration
sudo nginx -t  # or sudo apache2ctl configtest

# Manual deployment test
cd /tmp
tar -xzf deployment.tar.gz
ls -la out/  # Verify contents
```

## Security Considerations

- SSH keys are stored securely in GitHub secrets
- Deployment artifacts are verified for integrity
- Web server security headers are configured
- Regular backups are maintained
- Audit logs are available in GitHub Actions
- Principle of least privilege for deploy user

## Performance Optimizations

- Static asset caching (1 year for immutable assets)
- Gzip compression enabled
- CDN integration (consider Cloudflare)
- Image optimization via Next.js
- Service Worker for offline functionality