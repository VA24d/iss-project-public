# from audioop import add
import os

try:
    import mysql.connector
    import psycopg2
    import soundfile as sf

except Exception:
    exit(1)

          
def create_user_table():
    create_table_command = """
    CREATE TABLE user_details (
        public_id VARCHAR(256) PRIMARY KEY,
        name VARCHAR(256) NOT NULL,
        email VARCHAR(256) NOT NULL,
        password VARCHAR(512) NOT NULL,
        admin BOOLEAN NOT NULL,
        date_created DATE NOT NULL
    );"""
    
    cnx = mysql.connector.connect(
        user="root",
        password="12345678",
        host="localhost",
        connect_timeout=30,
    )
    cursor = cnx.cursor()
    cursor.execute("CREATE DATABASE IF NOT EXISTS course_project")
    cursor.execute("USE course_project")
    
    cursor.execute(create_table_command)
    
    cnx.commit()
    
    if cursor.rowcount == 0:
        return True
    else:
        return False



def connect_to_db():
    pscon = psycopg2.connect(os.environ["DATABASE_URL"])
    return pscon


def add_predefined_images():
    cnx = connect_to_db()
    cursor = cnx.cursor()
    cursor.execute(
        "CREATE TABLE user_images (image_id varchar(256) AUTO_INCREMENT PRIMARY KEY, user_id varchar(256), image_type varchar(256), image_data BYTEA, image_width INT, image_height INT, image_size BIGINT, image_name VARCHAR(4096))"
    )
    cnx.commit()
    
def connect_and_create_table(table_name, create_table_query):
    cnx = connect_to_db()
    cursor = cnx.cursor()
    cursor.execute(create_table_query)

    # Check if the table is empty
    cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
    count = cursor.fetchone()[0]

    cnx.commit()

    return cnx, cursor, count

def add_predefined_audios(table_name, directory):
    create_table_query = (
        f"CREATE TABLE IF NOT EXISTS {table_name} "
        "(audio_name VARCHAR(100), audio_data BYTEA, audio_size INT, audio_duration FLOAT, audio_tags VARCHAR(100));"
    )

    cnx, cursor, count = connect_and_create_table(table_name, create_table_query)
    
    if count!=0 and count != len(os.listdir(directory)):
        cursor.execute(f"DELETE FROM {table_name}")
        count=0

    if count == 0:  # If the table is empty, add data
        def get_audio_metadata(file_path):
            with sf.SoundFile(file_path) as audio_file:
                metadata = {
                    "audio_name": os.path.basename(file_path).split(".")[0],
                    "duration": len(audio_file) / audio_file.samplerate,
                    "channels": audio_file.channels,
                    "samplerate": audio_file.samplerate,
                    "format": audio_file.format,
                    # Add more metadata fields as needed
                }
            return metadata
        
        for filename in os.listdir(directory):
            file_path = os.path.join(directory, filename)
            metadata = get_audio_metadata(file_path)

            insert = f"INSERT INTO {table_name} (audio_name, audio_data, audio_size, audio_duration, audio_tags) VALUES ('{metadata['audio_name']}', %s, {os.path.getsize(file_path)}, {metadata['duration']}, 'predefined')"
            
            try:
                cursor.execute(insert, (open(file_path, "rb").read(),))
                cnx.commit()  
            except Exception as e:
                print(e)
                print("Jumping to next file")
                continue
            print(f"Added {metadata['audio_name']} to {table_name}")
        
         
        
    # a,b,count = connect_and_create_table(table_name, create_table_query) 

    # print(count)
    #cnx.close()


def add_predefined_Transition_audio():
    add_predefined_audios("AudioTracks", r"./pre_def/Transition audio")


def add_predefined_audiotracks():
    add_predefined_audios("Soundtracks", r"./pre_def/Soundtracks")

# add_predefined_Transition_audio()
add_predefined_audiotracks()