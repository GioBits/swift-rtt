class FormatUtils {
      static formatFileSize(bytes) {
            if (bytes < 1024) return `${bytes} B`;
            else if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
            else return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
      }

      static formatDateWithLeadingZeros(dateStr) {
            const d = new Date(dateStr);
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            return `${day}/${month}/${year}`;
      }

      static formatTimeWithLeadingZeros(dateStr) {
            const utcDate = new Date(dateStr + 'Z'); 
            return utcDate.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false
            });
      }


      static removeExtension(filename) {
            return filename.replace(/\.[^/.]+$/, '');
      }
}

export default FormatUtils;