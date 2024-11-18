sudo apt-get update
sudo apt-get install python3-pip python3-venv -y
python3 -m venv nine57
source nine57/bin/activate
# pip3 install Django


git clone https://github.com/nine57/ninePJT.git
cd ninePJT
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py collectstatic
source .env
sudo -E $(which python) manage.py runserver 0.0.0.0:80



source nine57/bin/activate
cd ninePJT
source .env
