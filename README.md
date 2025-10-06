# Pocket Alert GitHub Action

Send push notifications to your Android and iOS devices directly from your GitHub Actions workflows using Pocket Alert powerful notification management platform.

## Features

- 🚀 **Simple setup** - Just add your token and send push notifications
- 📱 **Cross-platform notifications** - Send to Android and iOS devices seamlessly
- 🔧 **Minimal dependencies** - Uses only Node.js built-in modules
- ⚡ **Fast execution** - No Docker overhead, runs directly on GitHub runners
- 🛡️ **Secure** - Token-based authentication
- 📲 **Real-time delivery** - Instant push notifications to your mobile devices
- 🎯 **Device targeting** - Send to specific devices or broadcast to all
- 🔔 **Rich notifications** - Support for custom titles and messages

## About Pocket Alert

Pocket Alert is a comprehensive notification management platform that consolidates all your alerts in one place. With our mobile apps for [iOS](https://apps.apple.com/us/app/pocket-alert-notifications/id6446805143) and [Android](https://play.google.com/store/apps/details?id=com.pocketalert.app&pli=1), you can receive real-time push notifications from your GitHub Actions, monitoring systems, and custom applications.

### Key Benefits:
- **Centralized notifications** - All your critical alerts in one mobile app
- **Cross-platform support** - Works on both Android and iOS devices
- **API integration** - Easy integration with GitHub Actions and other services
- **Real-time delivery** - Instant push notifications to your devices
- **Customizable alerts** - Rich notifications with custom titles and messages

## Usage

### Basic Usage

```yaml
name: Send Notification
on:
  push:
    branches: [ main ]

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - name: Send Pocket Alert Notification
        uses: PocketAlert/notification-action@v1.0.0
        with:
          token: ${{ secrets.POCKET_ALERT_TOKEN }}
          title: "Build Completed"
          message: "Your build has finished successfully!"
```

### Advanced Usage

```yaml
name: Deploy and Notify
on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy Application
        run: |
          # Your deployment steps here
          echo "Deployment completed"
      
      - name: Notify Deployment Success
        uses: PocketAlert/notification-action@v1.0.0
        with:
          token: ${{ secrets.POCKET_ALERT_TOKEN }}
          title: "🚀 Deployment Successful"
          message: "Application deployed successfully to production."
          application_id: "your-app-id" # Optional
          device_id: "specific-device-id"  # Optional
      
      - name: Notify Deployment Failure
        if: failure()
        uses: PocketAlert/notification-action@v1.0.0
        with:
          token: ${{ secrets.POCKET_ALERT_TOKEN }}
          title: "❌ Deployment Failed"
          message: "Deployment failed. Please check the logs."
          application_id: "your-app-id" # Optional
          device_id: "specific-device-id"  # Optional
```

## Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `token` | Pocket Alert API token | ✅ | - |
| `title` | Notification title | ✅ | - |
| `message` | Notification message | ✅ | - |
| `application_id` | Pocket Alert application ID | ❌ | - |
| `device_id` | Target device ID (optional) | ❌ | All devices |

## Outputs

| Output | Description |
|--------|-------------|
| `response` | Raw API response from Pocket Alert |
| `success` | Boolean indicating if notification was sent successfully |

## Setup

### 1. Get Your API Token

1. Go to [Pocket Alert Dashboard](https://pocketalert.app)
2. Sign in to your account
3. Create a new [API token](https://pocketalert.app/account/apikeys)
4. Copy the generated token

> **💡 Tip**: Download the Pocket Alert mobile app for [iOS](https://apps.apple.com/us/app/pocket-alert-notifications/id6446805143) or [Android](https://play.google.com/store/apps/details?id=com.pocketalert.app&pli=1) to receive notifications on your phone!

### 2. Add Token to GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings → Secrets and variables → Actions**
3. Click **New repository secret**
4. Name: `POCKET_ALERT_TOKEN`
5. Value: Your API token from Pocket Alert
6. Click **Add secret**

### 3. Get Your Application ID (Optional)

1. In Pocket Alert dashboard, go to [Applications](https://pocketalert.app/applications)
2. Find your application
3. Copy the Application ID
4. **Note**: Application ID is optional - notifications will be sent to all your devices if not specified

### 4. Get Your Device ID (Optional)

1. In Pocket Alert dashboard, go to [Devices](https://pocketalert.app/devices)
2. Find your device (iPhone, Android, etc.)
3. Copy the Device ID
4. **Note**: Device ID is optional - notifications will be sent to all your devices if not specified

### 5. Create Workflow

Create `.github/workflows/notify.yml` in your repository:

```yaml
name: Notify on Changes
on:
  push:
    branches: [ main ]
  pull_request:
    types: [opened, closed]

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - name: Send Notification
        uses: PocketAlert/notification-action@v1.0.0
        with:
          token: ${{ secrets.POCKET_ALERT_TOKEN }}
          title: "Repository Update"
          message: "New changes pushed to ${{ github.ref_name }}"
```

## Examples

### CI/CD Notifications

```yaml
name: CI/CD Pipeline
on:
  push:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Tests
        run: npm test
      
      - name: Notify Test Results
        if: always()
        uses: PocketAlert/notification-action@v1.0.0
        with:
          token: ${{ secrets.POCKET_ALERT_TOKEN }}
          title: "Test Results"
          message: "Tests ${{ job.status }} for ${{ github.ref_name }}"

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy
        run: echo "Deploying..."
      
      - name: Notify Deployment
        uses: PocketAlert/notification-action@v1.0.0
        with:
          token: ${{ secrets.POCKET_ALERT_TOKEN }}
          title: "🚀 Production Deploy"
          message: "Successfully deployed to production"
```

### Error Monitoring

```yaml
name: Error Monitoring
on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours

jobs:
  health-check:
    runs-on: ubuntu-latest
    steps:
      - name: Check Application Health
        id: health
        run: |
          if curl -f https://your-app.com/health; then
            echo "status=healthy" >> $GITHUB_OUTPUT
          else
            echo "status=unhealthy" >> $GITHUB_OUTPUT
          fi
      
      - name: Notify Health Status
        if: steps.health.outputs.status == 'unhealthy'
        uses: PocketAlert/notification-action@v1.0.0
        with:
          token: ${{ secrets.POCKET_ALERT_TOKEN }}
          title: "⚠️ Health Check Failed"
          message: "Application health check failed at $(date)"
```

### Release Notifications

```yaml
name: Release Notification
on:
  release:
    types: [published]

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - name: Notify Release
        uses: PocketAlert/notification-action@v1.0.0
        with:
          token: ${{ secrets.POCKET_ALERT_TOKEN }}
          title: "🎉 New Release: ${{ github.event.release.tag_name }}"
          message: |
            New version ${{ github.event.release.tag_name }} has been released!
            
            ${{ github.event.release.body }}
```

## Using Outputs

```yaml
- name: Send Notification
  id: notify
  uses: PocketAlert/notification-action@v1.0.0
  with:
    token: ${{ secrets.POCKET_ALERT_TOKEN }}
    title: "Test Notification"
    message: "This is a test"

- name: Check Result
  if: steps.notify.outputs.success == 'true'
  run: echo "Notification sent successfully!"

- name: Handle Failure
  if: steps.notify.outputs.success == 'false'
  run: echo "Failed to send notification: ${{ steps.notify.outputs.response }}"
```

## Troubleshooting

### Common Issues

**❌ "Token is required"**
- Make sure you've added `POCKET_ALERT_TOKEN` to your repository secrets
- Verify the secret name matches exactly

**❌ "Application ID is required"**
- Get your application ID from Pocket Alert dashboard
- Make sure the application exists and you have access

**❌ "Failed to send notification"**
- Check your API token is valid
- Verify the application ID is correct
- Ensure your Pocket Alert account is active

**❌ "Device not found"**
- If using `device_id`, make sure the device exists
- Remove `device_id` to send to all devices

### Debug Mode

Enable debug logging by adding this to your workflow:

```yaml
- name: Send Notification
  uses: PocketAlert/notification-action@v1.0.0
  with:
    token: ${{ secrets.POCKET_ALERT_TOKEN }}
    title: "Debug Test"
    message: "Testing with debug info"
  env:
    ACTIONS_STEP_DEBUG: true
```

## Mobile Apps

Download Pocket Alert mobile apps to receive push notifications on your devices:

- **iOS**: [Download from App Store](https://apps.apple.com/us/app/pocket-alert-notifications/id6446805143)
- **Android**: [Download from Google Play](https://play.google.com/store/apps/details?id=com.pocketalert.app&pli=1)

## Why Choose Pocket Alert?

- ✅ **Cross-platform push notifications** for Android and iOS
- ✅ **Real-time delivery** - Get instant alerts on your mobile devices
- ✅ **Centralized management** - All your notifications in one place
- ✅ **Easy integration** - Simple API for GitHub Actions and other services
- ✅ **Customizable alerts** - Rich notifications with custom content
- ✅ **Reliable delivery** - Built for critical notifications and monitoring

## License

MIT License - see LICENSE file for details.

---

Made with ❤️ by the [Pocket Alert team](https://pocketalert.app/)
