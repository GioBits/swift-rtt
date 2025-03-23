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

      static convertToISO = (dateStr) => {
            const parts = dateStr.split('/');
            if (parts.length !== 3) return dateStr;
            const [day, month, year] = parts;
            const dd = day.padStart(2, '0');
            const mm = month.padStart(2, '0');
            return `${year}-${mm}-${dd}`;
      };

      static formatFileSizeRemove = (size) => {
            const [value, unit] = size.split(' ');
            if (unit === 'KB') return parseInt(value);
            if (unit === 'MB') return parseInt(value) * 1024;
            return 0;
      };
}

export default FormatUtils;