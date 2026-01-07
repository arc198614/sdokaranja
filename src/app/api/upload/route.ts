import { NextResponse } from 'next/server';
import { getDriveClient } from '@/lib/google/auth';
import { createSajaFolder } from '@/lib/google/drive';
import { Readable } from 'stream';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const sajaName = formData.get('sajaName') as string || 'General';

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const drive = getDriveClient();
        const folderId = await createSajaFolder(sajaName);

        const buffer = Buffer.from(await file.arrayBuffer());
        const stream = new Readable();
        stream.push(buffer);
        stream.push(null);

        const response = await drive.files.create({
            requestBody: {
                name: file.name,
                parents: folderId ? [folderId] : undefined,
            },
            media: {
                mimeType: file.type,
                body: stream,
            },
            fields: 'id, webViewLink',
        });

        // Make file public or accessible via link
        await drive.permissions.create({
            fileId: response.data.id!,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });

        return NextResponse.json({
            success: true,
            fileId: response.data.id,
            webViewLink: response.data.webViewLink
        });
    } catch (error: any) {
        console.error('Drive Upload Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
