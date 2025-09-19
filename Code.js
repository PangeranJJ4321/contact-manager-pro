// Google Apps Script Code untuk Contact Manager

const SHEET_NAME = 'Contacts'; // Nama sheet

const getSheet = () => {
  const SHEET_ID = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  if (!SHEET_ID) {
    throw new Error('SHEET_ID belum diset. Gunakan setupSheet() terlebih dahulu.');
  }
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  // Buat sheet baru jika belum ada
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    // Tambahkan header
    sheet.getRange(1, 1, 1, 4).setValues([['ID', 'Nama', 'Email', 'Divisi']]);
    sheet.getRange(1, 1, 1, 4).setFontWeight('bold');
    sheet.getRange(1, 1, 1, 4).setBackground('#f0f0f0');
  }
  
  return sheet;
}

// Setup awal - panggil sekali untuk setup SHEET_ID
const setupSheet = (sheetId) => {
  PropertiesService.getScriptProperties().setProperty('SHEET_ID', sheetId);
  console.log('Sheet ID berhasil disimpan:', sheetId);
}

const doGet = () => {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Contact Manager Pro')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// Mendapatkan semua kontak
const getContacts = () => {
  try {
    const sheet = getSheet();
    const data = sheet.getDataRange().getValues();
    
    // Jika hanya ada header, return array kosong dengan header
    if (data.length <= 1) {
      return [['ID', 'Nama', 'Email', 'Divisi']];
    }
    
    return data;
  } catch (error) {
    console.error('Error getting contacts:', error);
    throw new Error('Gagal mengambil data kontak: ' + error.message);
  }
};

// Menambah kontak baru
const addContact = (nama, email, divisi) => {
  try {
    if (!nama || !email || !divisi) {
      throw new Error('Semua field harus diisi');
    }
    
    // Validasi email
    if (!isValidEmail(email)) {
      throw new Error('Format email tidak valid');
    }
    
    const sheet = getSheet();
    
    // Cek duplikasi email
    const existingData = sheet.getDataRange().getValues();
    const emailExists = existingData.slice(1).some(row => row[2] && row[2].toLowerCase() === email.toLowerCase());
    
    if (emailExists) {
      throw new Error('Email sudah terdaftar');
    }
    
    // Generate ID baru
    const lastRow = sheet.getLastRow();
    const newId = lastRow > 1 ? Math.max(...existingData.slice(1).map(row => row[0] || 0)) + 1 : 1;
    
    // Tambah data baru
    sheet.appendRow([newId, nama, email, divisi]);
    
    // Format row yang baru ditambahkan
    const newRowNum = sheet.getLastRow();
    sheet.getRange(newRowNum, 1, 1, 4).setBorder(true, true, true, true, false, false);
    
    return {
      success: true,
      message: 'Kontak berhasil ditambahkan',
      id: newId
    };
    
  } catch (error) {
    console.error('Error adding contact:', error);
    return {
      success: false,
      message: error.message
    };
  }
};

// Mengupdate kontak
const updateContact = (id, nama, email, divisi) => {
  try {
    if (!id || !nama || !email || !divisi) {
      throw new Error('Semua field harus diisi');
    }
    
    if (!isValidEmail(email)) {
      throw new Error('Format email tidak valid');
    }
    
    const sheet = getSheet();
    const data = sheet.getDataRange().getValues();
    
    // Cari row berdasarkan ID
    let rowIndex = -1;
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == id) {
        rowIndex = i + 1; // +1 karena sheet index mulai dari 1
        break;
      }
    }
    
    if (rowIndex === -1) {
      throw new Error('Kontak tidak ditemukan');
    }
    
    // Cek duplikasi email (kecuali untuk kontak yang sedang diedit)
    const emailExists = data.slice(1).some((row, index) => 
      row[2] && row[2].toLowerCase() === email.toLowerCase() && (index + 2) !== rowIndex
    );
    
    if (emailExists) {
      throw new Error('Email sudah digunakan oleh kontak lain');
    }
    
    // Update data
    sheet.getRange(rowIndex, 2, 1, 3).setValues([[nama, email, divisi]]);
    
    return {
      success: true,
      message: 'Kontak berhasil diperbarui'
    };
    
  } catch (error) {
    console.error('Error updating contact:', error);
    return {
      success: false,
      message: error.message
    };
  }
};

// Menghapus kontak
const deleteContact = (id) => {
  try {
    if (!id) {
      throw new Error('ID kontak tidak valid');
    }
    
    const sheet = getSheet();
    const data = sheet.getDataRange().getValues();
    
    // Cari row berdasarkan ID
    let rowIndex = -1;
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == id) {
        rowIndex = i + 1; // +1 karena sheet index mulai dari 1
        break;
      }
    }
    
    if (rowIndex === -1) {
      throw new Error('Kontak tidak ditemukan');
    }
    
    // Hapus row
    sheet.deleteRow(rowIndex);
    
    return {
      success: true,
      message: 'Kontak berhasil dihapus'
    };
    
  } catch (error) {
    console.error('Error deleting contact:', error);
    return {
      success: false,
      message: error.message
    };
  }
};

// Mencari kontak berdasarkan query
const searchContacts = (query) => {
  try {
    const sheet = getSheet();
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return [data[0]]; // Return header saja
    }
    
    const searchQuery = query.toLowerCase();
    const filteredData = data.filter((row, index) => {
      if (index === 0) return true; // Keep header
      
      return row.some(cell => 
        cell && cell.toString().toLowerCase().includes(searchQuery)
      );
    });
    
    return filteredData;
    
  } catch (error) {
    console.error('Error searching contacts:', error);
    throw new Error('Gagal mencari kontak: ' + error.message);
  }
};

// Mendapatkan statistik
const getStats = () => {
  try {
    const sheet = getSheet();
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return {
        totalContacts: 0,
        divisions: {},
        topDivision: 'Tidak ada'
      };
    }
    
    const contacts = data.slice(1);
    const divisions = {};
    
    contacts.forEach(contact => {
      const division = contact[3] || 'Tidak ada divisi';
      divisions[division] = (divisions[division] || 0) + 1;
    });
    
    const topDivision = Object.keys(divisions).reduce((a, b) => 
      divisions[a] > divisions[b] ? a : b, 'Tidak ada'
    );
    
    return {
      totalContacts: contacts.length,
      divisions: divisions,
      topDivision: topDivision
    };
    
  } catch (error) {
    console.error('Error getting stats:', error);
    return {
      totalContacts: 0,
      divisions: {},
      topDivision: 'Error'
    };
  }
};

// Export contacts ke CSV format
const exportContactsCSV = () => {
  try {
    const sheet = getSheet();
    const data = sheet.getDataRange().getValues();
    
    // Convert ke CSV format
    const csvContent = data.map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');
    
    return {
      success: true,
      data: csvContent,
      filename: `contacts_${new Date().toISOString().split('T')[0]}.csv`
    };
    
  } catch (error) {
    console.error('Error exporting contacts:', error);
    return {
      success: false,
      message: 'Gagal mengekspor data: ' + error.message
    };
  }
};

// Import contacts dari CSV
const importContactsCSV = (csvData) => {
  try {
    const rows = csvData.split('\n').map(row => 
      row.split(',').map(cell => cell.replace(/"/g, '').trim())
    );
    
    // Skip header row
    const contactsToImport = rows.slice(1).filter(row => row.length >= 3 && row[0]);
    
    if (contactsToImport.length === 0) {
      throw new Error('Tidak ada data valid untuk diimpor');
    }
    
    const sheet = getSheet();
    let importedCount = 0;
    let errorCount = 0;
    const errors = [];
    
    contactsToImport.forEach((row, index) => {
      try {
        const [nama, email, divisi] = row;
        if (nama && email && divisi) {
          const result = addContact(nama, email, divisi);
          if (result.success) {
            importedCount++;
          } else {
            errorCount++;
            errors.push(`Baris ${index + 2}: ${result.message}`);
          }
        }
      } catch (error) {
        errorCount++;
        errors.push(`Baris ${index + 2}: ${error.message}`);
      }
    });
    
    return {
      success: true,
      imported: importedCount,
      errors: errorCount,
      errorDetails: errors,
      message: `${importedCount} kontak berhasil diimpor, ${errorCount} error`
    };
    
  } catch (error) {
    console.error('Error importing contacts:', error);
    return {
      success: false,
      message: 'Gagal mengimpor data: ' + error.message
    };
  }
};

// Utility function untuk validasi email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Backup data
const backupData = () => {
  try {
    const sheet = getSheet();
    const data = sheet.getDataRange().getValues();
    
    // Buat sheet backup dengan timestamp
    const ss = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SHEET_ID'));
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupSheetName = `Backup_${timestamp}`;
    
    const backupSheet = ss.insertSheet(backupSheetName);
    backupSheet.getRange(1, 1, data.length, data[0].length).setValues(data);
    
    // Format header
    backupSheet.getRange(1, 1, 1, data[0].length).setFontWeight('bold');
    backupSheet.getRange(1, 1, 1, data[0].length).setBackground('#f0f0f0');
    
    return {
      success: true,
      message: `Backup berhasil dibuat: ${backupSheetName}`,
      sheetName: backupSheetName
    };
    
  } catch (error) {
    console.error('Error creating backup:', error);
    return {
      success: false,
      message: 'Gagal membuat backup: ' + error.message
    };
  }
};

// Menghapus semua data (dengan konfirmasi)
const clearAllData = (confirmation) => {
  if (confirmation !== 'HAPUS_SEMUA_DATA') {
    return {
      success: false,
      message: 'Konfirmasi tidak valid'
    };
  }
  
  try {
    const sheet = getSheet();
    
    // Backup dulu sebelum menghapus
    const backupResult = backupData();
    if (!backupResult.success) {
      throw new Error('Gagal membuat backup sebelum menghapus data');
    }
    
    // Hapus semua data kecuali header
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      sheet.deleteRows(2, lastRow - 1);
    }
    
    return {
      success: true,
      message: 'Semua data berhasil dihapus',
      backup: backupResult.sheetName
    };
    
  } catch (error) {
    console.error('Error clearing data:', error);
    return {
      success: false,
      message: 'Gagal menghapus data: ' + error.message
    };
  }
};

// Function untuk testing (opsional)
const runTests = () => {
  console.log('=== Testing Contact Manager ===');
  
  try {
    // Test add contact
    console.log('Testing add contact...');
    const addResult = addContact('John Doe', 'john@test.com', 'IT');
    console.log('Add result:', addResult);
    
    // Test get contacts
    console.log('Testing get contacts...');
    const contacts = getContacts();
    console.log('Contacts count:', contacts.length - 1);
    
    // Test search
    console.log('Testing search...');
    const searchResult = searchContacts('john');
    console.log('Search results:', searchResult.length - 1);
    
    // Test stats
    console.log('Testing stats...');
    const stats = getStats();
    console.log('Stats:', stats);
    
    console.log('=== All tests completed ===');
    
  } catch (error) {
    console.error('Test error:', error);
  }
};