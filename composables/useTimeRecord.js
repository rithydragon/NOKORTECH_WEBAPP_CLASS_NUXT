export const useProfessorTeaching = () => {
    // Fetch teaching summary
    const fetchTeachingSummary = async (professorId, startDate, endDate) => {
      try {
        const { data, error } = await useHttp('/api/time_record/summary', {
            method:"POST",
          data: {
            professorId,
            startDate,
            endDate
          }
        });
  console.log("eeeeeeeeeeeeeeee",data)
        if (error.value) {
          throw createError({
            statusCode: error.value.statusCode,
            statusMessage: error.value.data?.message || 'Failed to fetch teaching summary'
          });
        }
  
        return data.value;
      } catch (error) {
        console.log('Error fetching teaching summary:', error);
        throw error;
      }
    };
  
    // Create teaching record
    const createTeachingRecord = async (ProfessorId, recordData) => {
      try {
        const { data, error } = await useHttp(`/api/time_record/create?ProfessorId=${ProfessorId}`, {method:'POST',data:{recordData:recordData}});
        // const { data, error } = await useHttp(`/professor-teaching/${professorId}/records`, recordData);
  
        if (error.value) {
          throw createError({
            statusCode: error.value.statusCode,
            statusMessage: error.value.data?.message || 'Failed to create teaching record'
          });
        }
  
        return data.value;
      } catch (error) {
        console.log('Error creating teaching record:', error);
        throw error;
      }
    };
  
    // Update teaching record
    const updateTeachingRecord = async (recordId, recordData) => {
      try {
        const { data, error } = await useHttp(`/api/time_record/update`,{method:'POST',data:{recordData:recordData}});
  
        if (error.value) {
          throw createError({
            statusCode: error.value.statusCode,
            statusMessage: error.value.data?.message || 'Failed to update teaching record'
          });
        }
  
        return data.value;
      } catch (error) {
        console.log('Error updating teaching record:', error);
        throw error;
      }
    };
  
    // Delete teaching record
    const deleteTeachingRecord = async (recordId) => {
      try {
        const { data, error } = await useHttp(`/api/time_record/delete?Id=${recordId}`);
  
        if (error.value) {
          throw createError({
            statusCode: error.value.statusCode,
            statusMessage: error.value.data?.message || 'Failed to delete teaching record'
          });
        }
  
        return data.value;
      } catch (error) {
        console.log('Error deleting teaching record:', error);
        throw error;
      }
    };
  
    return {
      fetchTeachingSummary,
      createTeachingRecord,
      updateTeachingRecord,
      deleteTeachingRecord
    };
  };