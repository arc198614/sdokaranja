import { getSheetsClient } from './auth';

// Using environment variable for sheet ID
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

export async function getSheetData(range: string) {
    const sheets = getSheetsClient();
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range,
    });
    return response.data.values;
}

export async function appendSheetData(range: string, values: any[][]) {
    const sheets = getSheetsClient();
    await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range,
        valueInputOption: 'RAW',
        requestBody: { values },
    });
}

export async function updateSheetData(range: string, values: any[][]) {
    const sheets = getSheetsClient();
    await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range,
        valueInputOption: 'RAW',
        requestBody: { values },
    });
}

// Question_Master operations
export async function getQuestions() {
    const data = await getSheetData('Question_Master!A2:E');
    return data?.map(row => ({
        id: row[0],
        department: row[1],
        questionText: row[2],
        isDocumentMandatory: row[3] === 'TRUE',
        marks: parseInt(row[4], 10),
    })) || [];
}

// Inspection_Log operations
export async function getInspectionLogs() {
    const data = await getSheetData('Inspection_Log!A2:F');
    return data?.map(row => ({
        inspectionId: row[0],
        date: row[1],
        sajaName: row[2],
        vroName: row[3],
        inspectionOfficer: row[4],
        status: row[5],
    })) || [];
}

// Responses_Compliance operations
export async function getResponses(logId?: string) {
    const data = await getSheetData('Responses_Compliance!A2:G');
    const filtered = logId ? data?.filter(row => row[0] === logId) : data;
    return filtered?.map(row => ({
        logId: row[0],
        questionId: row[1],
        officerFeedback: row[2],
        seniorOfficerOpinion: row[3],
        vroCompliance: row[4],
        driveLink: row[5],
        finalRemark: row[6],
    })) || [];
}

// Dashboard Stats
export async function getDashboardStats() {
    const questions = await getQuestions();
    const logs = await getInspectionLogs();

    const totalQuestions = questions.length.toString();
    const pendingInspections = logs.filter(l => l.status === 'PENDING' || l.status === 'प्रलंबित').length.toString();
    const completedInspections = logs.filter(l => l.status === 'COMPLETED' || l.status === 'पूर्ण').length.toString();
    const totalOfficers = [...new Set(logs.map(l => l.vroName))].length.toString();

    return [
        { label: 'एकूण प्रश्न', value: totalQuestions, icon: 'ClipboardList', color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'प्रलंबित तपासण्या', value: pendingInspections, icon: 'AlertCircle', color: 'text-amber-600', bg: 'bg-amber-100' },
        { label: 'पूर्ण तपासण्या', value: completedInspections, icon: 'CheckCircle', color: 'text-emerald-600', bg: 'bg-emerald-100' },
        { label: 'एकूण अधिकारी', value: totalOfficers, icon: 'Users', color: 'text-indigo-600', bg: 'bg-indigo-100' },
    ];
}
