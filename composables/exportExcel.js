import { utils, writeFile } from 'xlsx'
import { saveAs } from 'file-saver'

export const exportToExcel = (data, fileName = 'export') => {
  // Create worksheet
  const worksheet = utils.json_to_sheet(data)
  
  // Create workbook
  const workbook = utils.book_new()
  utils.book_append_sheet(workbook, worksheet, 'Sheet1')
  
  // Generate Excel file
  const excelBuffer = writeFile(workbook, `${fileName}.xlsx`, { bookType: 'xlsx', type: 'array' })
  
  // Save file
  saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), `${fileName}.xlsx`)
}