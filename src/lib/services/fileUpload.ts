export async function uploadFileToCloudinary(file: File, type: 'image' | 'video') {
	const url = `https://api.cloudinary.com/v1_1/ddqprmvot/${type}/upload`;
	const formData = new FormData();
	formData.append('file', file);
	formData.append('upload_preset', 'todo-app');

	const res = await fetch(url, {
		method: 'POST',
		body: formData
	});

	if (!res.ok) throw new Error('Failed to upload file. Please check your network or file type.');
	const data = await res.json();
	return data.secure_url;
}
