import requests
import os
from tqdm import tqdm


url = 'http://localhost:3000/app/fileIO/receiveFile'
file_path = 'C:/Users/sandk/Desktop/CRN7329369974.pdf'
token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6InNhbmRlZXAua3VtYXJAaWRyaXZlLmNvbSIsImlhdCI6MTY4NzU5NDc1MSwiZXhwIjoxNjg3NjgxMTUxfQ.58uv0HRSPqSCdkGHx_uFh2FyrKRggua-bw1LHGb3hQk"

headers = {
    'Authorization': token
}


def sendFile(filePath):
    try:
        print(os.stat(filePath))
    except Exception as e:
        print(e)


def file_paths(path):
    file_names = []
    file_paths = []
    if not os.path.isfile(path):
        for root, dirs, files in tqdm(os.walk(path), desc=f"{path}"):
            file_names.extend(files)
            for file in files:
                file_paths.append(os.path.join(root, file))
        return {0: file_names, 1: file_paths}
    return {0: [os.path.basename(path)], 1: [path]}


dir = "C:\\Users\\sandk\\Desktop\\Projects\\Triox\\Triox Tech Pvt Ltd\\Triox CRM"
files = file_paths(dir)

# with open(file_path, 'rb') as f:
#     files = {'file': f}
#     response = requests.post(url, headers=headers, files=files)
#     print(response.json())
sendFile(files[1][10000])
