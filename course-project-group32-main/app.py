# from audioop import add
import os

print("The program has been initialized")
# print("Old modules found \nUpdating old modules...")

# os.system(r"pip list --outdated | cut -d ' ' -f 1 | xargs -n1 pip install -U")
# os.system("clear")

try:
    # from editor import create_audio_data
    # import azure.functions as func
    # import tempfile
    import editor

    # from calendar import c
    # from sqlite3 import connect
    # from venv import create
    import moviepy.editor as mpe

    # import soundfile as sf
    # from numpy import insert
    from flask import (
        Flask,
        request,
        # jsonify,
        make_response,
        render_template,
        # flash,
        redirect,
        url_for,
    )
    import os
    from werkzeug.security import generate_password_hash, check_password_hash
    import uuid
    import jwt
    import datetime
    import mysql.connector
    from functools import wraps
    import base64
    import time
    from PIL import Image
    import psycopg2
    import json
except Exception as e:
    print(e)
    pass
# except ImportError:
# print("Some Modules were missing\n Installing from requirements.txt..")
# os.system(r"pip install -r requirements.txt")
# print("Modules installed successfully")
# print("Re-Running the program")
# os.system("python app.py")
# exit(1)

# os.system(r"clear")


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


pscon = psycopg2.connect(os.environ["DATABASE_URL"])


def connect_to_db():
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


# def add_predefined_audios(table_name, directory):
#     create_table_query = (
#         f"CREATE TABLE IF NOT EXISTS {table_name} "
#         "(audio_name VARCHAR(100), audio_data LONGBLOB, audio_size INT, audio_duration FLOAT, audio_tags VARCHAR(100));"
#     )

#     cnx, cursor, count = connect_and_create_table(table_name, create_table_query)

#     if count!=0 and count != len(os.listdir(directory)):
#         cursor.execute(f"DELETE FROM {table_name}")
#         count=0

#     if count == 0:  # If the table is empty, add data
#         def get_audio_metadata(file_path):
#             with sf.SoundFile(file_path) as audio_file:
#                 metadata = {
#                     "audio_name": os.path.basename(file_path).split(".")[0],
#                     "duration": len(audio_file) / audio_file.samplerate,
#                     "channels": audio_file.channels,
#                     "samplerate": audio_file.samplerate,
#                     "format": audio_file.format,
#                     # Add more metadata fields as needed
#                 }
#             return metadata

#         for filename in os.listdir(directory):
#             file_path = os.path.join(directory, filename)
#             metadata = get_audio_metadata(file_path)

#             insert = f"INSERT INTO {table_name} (audio_name, audio_data, audio_size, audio_duration, audio_tags) VALUES ('{metadata['audio_name']}', %s, {os.path.getsize(file_path)}, {metadata['duration']}, 'predefined')"

#             cursor.execute(insert, (open(file_path, "rb").read(),))

#         cnx.commit()

#     # a,b,count = connect_and_create_table(table_name, create_table_query)

#     # print(count)
#     #cnx.close()


# def add_predefined_Transition_audio():
#     add_predefined_audios("AudioTracks", r"./pre_def/Transition audio")


# def add_predefined_audiotracks():
#     add_predefined_audios("Soundtracks", "./pre_def/Soundtracks")


# add_predefined_audiotracks()

# add_predefined_Transition_audio()

app = Flask(__name__)
app.config["SECRET_KEY"] = "78df64cc9984334d0ab38c8b8b5ff049"

image_upload_in_prog = False


def token_required(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token = None

        if "access-token" in request.cookies:
            token = request.cookies.get("access-token")

        if not token:
            # return jsonify({'message': 'a valid token is missing'})
            return redirect(url_for("login_page", error_msg="error_token_is_missing"))

        print(token)

        try:
            data = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
            print(data["public_id"])
            current_user = get_user_by_public_id(data["public_id"])
            if current_user is None:
                # return jsonify({'message': 'token is invalid'})
                return redirect(
                    url_for("login_page", error_msg="error_token_is_invalid")
                )
        except Exception:
            # print(e)
            # return jsonify({'message': 'token is invalid'})
            return redirect(url_for("login_page", error_msg="error_token_is_invalid"))

        return f(current_user, *args, **kwargs)

    return decorator


@app.route("/register")
def register_page():
    return render_template("register.html")


@app.route("/")
def start_page():
    return render_template("start.html")


@app.route("/login")
def login_pg():
    return render_template("login.html", error_message="")


@app.route("/login/<error_msg>")
def login_page(error_msg):
    print(error_msg)
    return render_template("login.html", error_message=error_msg)


@app.route("/gallery")
@token_required
def gallery_page(current_user):
    while image_upload_in_prog:
        print("slept")
        time.sleep(0.1)
    print(time.time())
    time.sleep(0.5)
    cnx = connect_to_db()

    cursor = cnx.cursor()
    cursor.execute(
        f"SELECT image_id, image_type, image_data FROM user_images WHERE user_id='{current_user['public_id']}'"
    )
    disp_images = cursor.fetchall()
    # cnx.close()
    fin_image = []
    for img in disp_images:
        new_image = []
        new_image.append(img[0])
        new_image.append(img[1])
        # print(f"image type {type(img[2])}")
        new_image.append(base64.b64encode(img[2].tobytes()).decode("ascii"))
        fin_image.append(new_image)
    return render_template(
        "gallery.html", username=current_user["name"], image_list=fin_image
    )


@app.route("/upload")
@token_required
def upload_page(current_user):
    return render_template("upload.html")


@app.route("/image_upload", methods=["POST"])
@token_required
def save_image(current_user):
    image_upload_in_prog = True
    try:
        print("Called once")

        file_data = request.files["file"]
        file_extension = request.form["extn"]
        file_type = request.form["file_type"]
        user_id = current_user["public_id"]
        # print("debug ", file_extension)
        image_id = str(uuid.uuid4())
        file_copy = file_data
        file_data = file_data.read()
        # file_data = base64.b64encode(file_data)
        iw = 0
        ih = 0
        file_copy_2 = file_copy
        cp = file_copy_2.tell()
        file_copy_2.seek(0, 2)
        size_b = file_copy_2.tell()
        with Image.open(file_copy) as img:
            iw, ih = img.size
        file_name = str(request.form["file_name"])

        # in_query = "INSERT INTO user_images (image_id, user_id, image_type, image_data, image_width, image_size, image_name) values (%s, %s, %s, %s, %s, %s, %s, %s)"

        # in_query = """INSERT INTO user_images (image_id, user_id, image_type, image_data) values (%s, %s, %s, %s, %s, %s, %s, %s)"""

        iw = str(iw)
        ih = str(ih)
        size_b = str(size_b)

        # file_data = file_data.decode("ascii")

        # in_query = f"INSERT INTO user_images (image_id, user_id, image_type, image_data, image_width, image_height, image_size, image_name) values ('{image_id}', '{user_id}', '{file_type}', '{file_data}', {iw}, {ih}, {size_b}, '{file_name}')"

        # print(in_query)
        # print(type(file_data))

        try:
            cnx = connect_to_db()
        except Exception:
            print("error in cnx")
            return 400

        try:
            cursor = cnx.cursor()
            # cursor.execute(in_query, (image_id, user_id, file_type, file_data, iw, ih, size_b, file_name))
            cursor.execute(
                "insert into user_images (image_id, user_id, image_type, image_data, image_width, image_height, image_size, image_name) values (%s, %s, %s, %s, %s, %s, %s, %s)",
                (image_id, user_id, file_type, file_data, iw, ih, size_b, file_name),
            )
            # print("executed")
            cnx.commit()
        except Exception as error:
            print(f"An exception occurred: {error}")
            # cnx.close()
            image_upload_in_prog = False
            return 400

        image_upload_in_prog = False

        print(time.time())

        return "success", 200
    except Exception as error:
        print(error)
        print("Reached here")
        image_upload_in_prog = False
        return "", 400

@app.route("/editor")
@token_required
def editor_page(current_user):
    images_req = None

    if "video_images" in request.cookies:
        images_req = request.cookies.get("video_images")

    if not images_req:
        # return jsonify({'message': 'a valid token is missing'})
        return redirect(url_for("gallery_page"))

    images_req = tuple(json.loads(images_req))
    print(images_req)
    print(type(images_req))
    cnx = connect_to_db()

    cursor = cnx.cursor()
    cursor.execute(
        "SELECT image_id, image_type, image_data FROM user_images WHERE user_id=%s AND image_id IN %s",
        (current_user["public_id"], images_req),
    )
    disp_images = cursor.fetchall()
    # cnx.close()
    fin_image = []
    for img in disp_images:
        new_image = []
        new_image.append(img[0])
        new_image.append(img[1])
        # print(f"image type {type(img[2])}")
        new_image.append(base64.b64encode(img[2].tobytes()).decode("ascii"))
        fin_image.append(new_image)
    if len(fin_image) < 1:
        return url_for("/gallery_page")

    # folder_path_s = r'pre_def'
    # folder_path_t = r'/pre_def/transition'

    # # Get the list of files in the folder
    # files_s = os.listdir(folder_path_s)
    # file_t = os.listdir(folder_path_t)

    # data_s={}
    # data_t={}

    cursor.execute("SELECT audio_name, audio_data, audio_duration FROM audiotracks")
    data_s = [list(v) for v in cursor.fetchall()]
    for i in range(len(data_s)):
        data_s[i][1] = base64.b64encode(data_s[i][1].tobytes()).decode("ascii")
    # print(data_s)

    cursor.execute("SELECT audio_name, audio_data, audio_duration FROM soundtracks")
    data_t = [list(v) for v in cursor.fetchall()]
    for i in range(len(data_t)):
        data_t[i][1] = base64.b64encode(data_t[i][1].tobytes()).decode("ascii")
    # print(data_t)

    # data_t = [tuple([v[0], v[1][0], v[[1][2]]]) for k, v in data_t.items()]
    # for i in range(len(files_s)):
    # data_s[i]={files_s[i], create_audio_data(folder_path_s+'/'+files_s[i])}
    # for i in range(len(file_t)):
    #     data_t[i]={file_t[i], create_audio_data(folder_path_t+'/'+file_t[i])}

    curClip = editor.get_clip_from_id(fin_image[0][0], connect_to_db())
    for i in range(1, len(fin_image)):
        curClip = editor.transition(
            curClip, editor.get_clip_from_id(fin_image[i][0], connect_to_db()), ""
        )
        # curClip = mpe.CompositeVideoClip([curClip, editor.get_clip_from_id(fin_image[i][0], connect_to_db())])
    file_n = current_user["public_id"]
    # temp_dir = tempfile.gettempdir()
    temp_dir = "static/fake_tmp"
    vid_path = f"{temp_dir}/{file_n}.mp4"
    curClip.write_videofile(vid_path, fps=30)
    vid_path = "/" + vid_path
    return render_template(
        "editor.html",
        image_list=fin_image,
        predef_audio_s=data_s,
        predef_audio_t=data_t,
        vid_src=vid_path,
    )

@app.route("/update_vid", methods=["POST"])
@token_required
def update_vid(current_user):
    data = request.form
    img_order = json.loads(data["img_ord"])
    img_trans = json.loads(data["img_trs"])
    img_dur = json.loads(data["img_dur"])
    audio_ins = json.loads(data["aud_ins"])
    audio_ls = json.loads(data["aud_ls"])

    res = 720
    fpss = 30
    th = res
    tw = (16 * res) // 9

    curClip = editor.get_clip_from_id(
        img_order[0], connect_to_db(), img_dur[img_order[0]], th, tw
    )
    for i in range(1, len(img_order)):
        curTrans = ""
        if img_order[i - 1] in img_trans:
            curTrans = img_trans[img_order[i - 1]]
        curClip = editor.transition(
            curClip,
            editor.get_clip_from_id(
                img_order[i], connect_to_db(), img_dur[img_order[i]], th, tw
            ),
            curTrans,
        )
    finClip = curClip
    if len(audio_ins) > 0:
        aud_clips = []
        for i in range(len(audio_ins)):
            aud_clips.append(
                editor.get_audio_from_name(audio_ins[i], pscon, audio_ls[i])
            )
        finAud = editor.conc_aud(aud_clips)
        duration = curClip.duration
        temp_audio_clip = finAud.set_duration(duration)
        final_audio_clip = mpe.CompositeAudioClip([temp_audio_clip])

        finClip = curClip.set_audio(final_audio_clip)

    file_n = current_user["public_id"]
    # temp_dir = tempfile.gettempdir()
    temp_dir = "static/fake_tmp"
    vid_path = f"{temp_dir}/{file_n}.mp4"
    finClip.write_videofile(vid_path, fps=fpss)
    return "success", 200


@app.route("/export")
@token_required
def export_pg(current_user):
    file_n = current_user["public_id"]
    # temp_dir = tempfile.gettempdir()
    temp_dir = "static/fake_tmp"
    vid_path = f"{temp_dir}/{file_n}.mp4"
    return render_template("export.html", video_path="/" + vid_path)


@app.route("/export_vid", methods=["POST"])
@token_required
def exp_vid(current_user):
    data = request.form
    img_order = json.loads(request.cookies.get("img_ord"))
    img_trans = json.loads(request.cookies.get("img_trs"))
    img_dur = json.loads(request.cookies.get("img_dur"))
    audio_ins = json.loads(request.cookies.get("aud_ins"))
    audio_ls = json.loads(request.cookies.get("aud_ls"))

    res = int(data["res"])
    fpss = int(data["fps"])

    th = res
    tw = (16 * res) // 9

    curClip = editor.get_clip_from_id(
        img_order[0], connect_to_db(), img_dur[img_order[0]], th, tw
    )
    for i in range(1, len(img_order)):
        curTrans = ""
        if img_order[i - 1] in img_trans:
            curTrans = img_trans[img_order[i - 1]]
        curClip = editor.transition(
            curClip,
            editor.get_clip_from_id(
                img_order[i], connect_to_db(), img_dur[img_order[i]], th, tw
            ),
            curTrans,
        )
    finClip = curClip
    if len(audio_ins) > 0:
        aud_clips = []
        for i in range(len(audio_ins)):
            aud_clips.append(
                editor.get_audio_from_name(audio_ins[i], pscon, audio_ls[i])
            )
        finAud = editor.conc_aud(aud_clips)
        duration = curClip.duration
        temp_audio_clip = finAud.set_duration(duration)
        final_audio_clip = mpe.CompositeAudioClip([temp_audio_clip])

        finClip = curClip.set_audio(final_audio_clip)

    file_n = current_user["public_id"]
    # temp_dir = tempfile.gettempdir()
    temp_dir = "static/fake_tmp"
    vid_path = f"{temp_dir}/{file_n}.mp4"
    finClip.write_videofile(vid_path, fps=fpss)
    return "success", 200


@app.route("/register_request", methods=["POST"])
def signup_user():
    data = request.form

    if len(data["name"]) < 1:
        return "Failed. Name cannot be empty."

    if len(request.form["password"]) < 8:
        return "Password should be atleast 8 characters in length."

    cnx = connect_to_db()

    cursor = cnx.cursor()

    cursor.execute(f"SELECT email FROM user_details WHERE email='{data['email']}'")

    if len(cursor.fetchall()) > 0:
        # cnx.close()
        return "Failed. Email is already in use."

    # cnx.close()

    hashed_password = generate_password_hash(data["password"])
    public_id = str(uuid.uuid4())

    cnx = connect_to_db()

    cur_date = datetime.datetime.today().strftime("%Y-%m-%d")

    cursor = cnx.cursor()
    cur_cmd = f"INSERT INTO user_details VALUES ('{public_id}', '{data['name']}', '{data['email']}', '{hashed_password}', 0, DATE '{cur_date}')"

    cursor.execute(cur_cmd)

    cnx.commit()

    # cnx.close()

    return redirect(url_for("login_page", error_msg="registered_successfully"))


@app.route("/logout", methods=["POST"])
def logout():
    resp = make_response(redirect("/"))
    resp.set_cookie("access-token", value="", expires=0)
    return resp


@app.route("/delete_images", methods=["POST"])
@token_required
def delete_image(current_user):
    image_id = request.form["image_id"]
    user_id = current_user["public_id"]

    cnx = connect_to_db()

    cursor = cnx.cursor()
    cursor.execute(
        f"DELETE FROM user_images WHERE image_id='{image_id}' AND user_id='{user_id}'"
    )
    cnx.commit()
    # cnx.close()
    return "success", 200


def get_user_by_public_id(public_id):
    cnx = connect_to_db()

    cursor = cnx.cursor()

    cursor.execute(f"SELECT * FROM user_details WHERE public_id='{public_id}'")

    user = cursor.fetchone()
    if user:
        # cnx.close()
        return {
            "public_id": user[0],
            "name": user[1],
            "email": user[2],
            "password": user[3],
            "admin": user[4],
            "date": user[5],
        }
    else:
        # cnx.close()
        return None


@app.route("/admin")
@token_required
def admin_page(current_user):
    if current_user["admin"] == 0:
        return "Access Denied"
    cnx = connect_to_db()

    cursor = cnx.cursor()
    cursor.execute("SELECT * FROM user_details")
    user_data = cursor.fetchall()
    # cnx.close()
    return render_template("admin.html", entries=user_data)


@app.route("/login_request", methods=["POST"])
def login_user():
    auth = request.form

    if not auth or not auth["email"] or not auth["password"]:
        return redirect(url_for("login_page", error_msg="login_required"))

    cnx = connect_to_db()

    cursor = cnx.cursor()

    cursor.execute(f"SELECT * FROM user_details WHERE email='{auth['email']}'")
    user = cursor.fetchone()

    # cnx.close()

    if user and check_password_hash(user[3], auth["password"]):
        token = jwt.encode(
            {
                "public_id": user[0],
                "exp": datetime.datetime.utcnow() + datetime.timedelta(30),
            },
            app.config["SECRET_KEY"],
            "HS256",
        )
        if user[4] == 1:
            resp = make_response(redirect("/admin"))
        else:
            resp = make_response(redirect("/gallery"))
        resp.set_cookie(
            "access-token",
            value=token,
            expires=datetime.datetime.utcnow() + datetime.timedelta(30),
        )
        return resp

    return redirect(url_for("login_page", error_msg="invalid_credentials"))


if __name__ == "__main__":
    # print(os.environ["DATABASE_URL"])
    # app.run(debug=True, host="0.0.0.0")
    app.run()
