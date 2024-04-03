import os
import editor as ed

folder_path_s = r'pre_def/Soundtracks'  
folder_path_t = r'pre_def/Transition audio'  
    
    # Get the list of files in the folder
files_s = os.listdir(folder_path_s)
files_t = os.listdir(folder_path_t)

data_s={}
data_t={}
    
for i in range(len(files_s)):
    data_s[i]=[folder_path_s+'/'+files_s[i], ed.create_audio_data(folder_path_s+'/'+files_s[i])]
for i in range(len(files_t)):
    data_t[i]=[folder_path_t+'/'+files_t[i], ed.create_audio_data(folder_path_t+'/'+files_t[i])]
    
print(data_s)
print(data_t)