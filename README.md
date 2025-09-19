# 📇 Contact Manager Pro

> Modern contact management system built with Google Apps Script and vanilla JavaScript

![Contact Manager Pro](https://img.shields.io/badge/Status-Active-brightgreen) ![Version](https://img.shields.io/badge/Version-1.0.0-blue) ![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- 📝 **CRUD Operations** - Add, view, edit, delete contacts
- 🔍 **Real-time Search** - Find contacts instantly
- 📊 **Statistics Dashboard** - View contact analytics
- 📤 **Export/Import CSV** - Bulk data operations
- 💾 **Auto Backup** - Automatic data backup system
- 📱 **Responsive Design** - Works on all devices
- 🎨 **Modern UI** - Clean glassmorphism design
- ⚡ **Fast Performance** - Optimized for speed

## 🚀 Quick Start

### Prerequisites
- Google Account
- Access to Google Sheets & Apps Script

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/contact-manager-pro.git
   cd contact-manager-pro
   ```

2. **Create a new Google Apps Script project**
   - Go to [script.google.com](https://script.google.com)
   - Click "New Project"

3. **Setup the files**
   - Copy `Code.js` content to the Apps Script editor
   - Create new HTML file named `index` and copy the HTML content
   - Save the project

4. **Create Google Sheet**
   - Create a new Google Sheet
   - Copy the Sheet ID from URL
   - Run `setupSheet('YOUR_SHEET_ID')` in Apps Script console

5. **Deploy as Web App**
   - Click Deploy → New deployment
   - Choose "Web app" type
   - Set execute as "Me" and access to "Anyone"
   - Deploy and copy the web app URL

## 🎯 Usage

### Adding Contacts
1. Fill in the form with Name, Email, and Division
2. Click "Tambah Kontak" to save

### Managing Contacts
- **Edit**: Click the edit icon next to any contact
- **Delete**: Click the delete icon and confirm
- **Search**: Use the search box to filter contacts

### Data Operations
- **Export**: Click "Export CSV" to download all contacts
- **Import**: Click "Import CSV" to upload contact data
- **Backup**: Click "Backup" to create a backup sheet

## 📁 Project Structure

```
contact-manager-pro/
├── Code.js              # Google Apps Script backend
├── index.html           # Frontend application
├── README.md           # Project documentation
└── setup-instructions.md  # Detailed setup guide
```

## 🛠️ Tech Stack

- **Backend**: Google Apps Script
- **Frontend**: HTML5, JavaScript (Vanilla)
- **Styling**: Tailwind CSS
- **Database**: Google Sheets
- **Icons**: Heroicons (SVG)

## 🔧 Configuration

### Environment Setup
```javascript
// Run once in Apps Script console
setupSheet('1ABC123DEF456GHI789JKL'); // Your Google Sheet ID
```

### Customization
- Modify form fields in `index.html`
- Update validation rules in JavaScript
- Customize styling with Tailwind classes
- Add new features in `Code.js`


## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Live Demo](https://script.google.com/your-web-app-url) *(Replace with your URL)*
- [Documentation](./setup-instructions.md)
- [Issues](https://github.com/yourusername/contact-manager-pro/issues)

## 🆘 Support

If you have any questions or run into issues:

1. Check the [setup instructions](./setup-instructions.md)
2. Look at [existing issues](https://github.com/yourusername/contact-manager-pro/issues)
3. Create a new issue if needed

## ⭐ Show your support

Give a ⭐️ if this project helped you!

---

**Made with ❤️ by [Your Name](https://github.com/PangeranJJ4321)**
