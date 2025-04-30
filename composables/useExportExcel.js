import { exportToExcel } from '~/utils/exportExcel'

export const useExcelExport = () => {
  const exportData = (data, fileName) => {
    try {
      // Transform data if needed
      const exportData = data.map(item => ({
        'Student ID': item.Id,
        'Student Code': item.StudentCode,
        'Name': item.Name,
        'English Name': item.EnglishName,
        'Gender': item.Gender,
        'Date of Birth': item.DOB,
        'Midterm Score': item.Midterm,
        'Final Score': item.Final,
        'Total Score': item.Total,
        'Note': item.Note
      }))
      
      exportToExcel(exportData, fileName || 'student_scores')
    } catch (error) {
      console.log('Export error:', error)
    }
  }

  return { exportData }
}