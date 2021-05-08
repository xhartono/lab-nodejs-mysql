# Menggunakan nodejs-mysql dengan docker

Menjalankan aplikasi nodejs dengan database mysql menggunakan arsitektur docker dan microservice

### Tujuan

- Menjalankan server mysql di docker container.
- Menjalankan aplikasi nodejs sederhana pada docker container yang terpisah.
- Menghubungkan kedua container dan uji integrasi aplikasi mysql-nodejs.

### Persyaratan

- Telah menginstall docker di sistem Anda.

### Menjalankan MySQL Container

1. Clone repository ini dengan
```bash
$ git clone https://github.com/xhartono/nodejs-mysql.git
$ git checkout master
$ tree
```
> Catatan:
> - Jika utilitas tree belum diinstall:
- Di Ubuntu
```bash
$ sudo apt install tree -y
```
- di Centos
```bash
$ sudo dnf install tree -y
```
2. Pindah ke direktori `nodejs-mysql`
```bash
$ cd nodejs-mysql/mysql
$ ls
```
3. Buat MySQL docker image berdasarkan Dockerfile yang telah dibuat
```bash
$ docker images
$ docker build -t tutorial/mysqlku .
$ docker images
```
4. Jalankan images yang sudah berhasil dibuat 
```bash
$ docker ps -a
$ docker run -d -p 3306:3306 \
	-v $(pwd)/data:/var/lib/mysql \
	--name mysqlku1 \
	tutorial/mysqlku
$ docker ps -a
```
5. Lihat logs apakah container tidak terdapat error
```bash
$ docker logs -f mysqlku1
```
> Catatan:
> - Tekan ctrl-c untuk keluar dari logs

6. Lihat apakah data dummy telah terbentuk pada database
```bash
$ docker exec -t mysqlku1 \
	mysql -uroot -ppassword test -e 'select * from students;
```
7. Anda telah berhasil menjalankan mysql pada docker container

### Menjalankan NodeJS pada docker container
1. Aktifkan direktory nodejs
```bash
$ cd ../nodejs
$ ls
```
> Catatan:
> - Dockerfile: untuk membuat Docker Images
> - package.json: Konfigurasi dan dependencies yang diperlukan aplikasi nodejs
> - index.js: aplikasi nodejs akses ke mysql

2. Build image nodejs berdasarkan Dockerfile yang telah dibuat
```bash
$ docker images
$ docker built -t tutorial/nodejsku .
$ docker images
```

3. Jalankan image yang baru dibuat semagai container
```
docker run  -d \
	-p 4000:4000 \
	-e MYSQL_USER=root \
	-e MYSQL_PASSWORD=password \
	-e MYSQL_DATABASE=test \
	-e MYSQL_HOST=db \
	--link mysqlku1:db \
	--name=nodejsku1 nodejsku
```

### Uji coba aplikasi yang lengkap

1. Akses homepage dari app:
```bash
$ curl -X GET localhost:4000
```
2. Tampilkan semua students
```bash
$ curl -X POST localhost:4000/get-students
```
> Catatan:
> - Agar tampilan hasil query diatas tersusun rapi, install jq
- di Ubuntu
```bash
$ sudo apt install -y jq
```
- di Centos
```bash
$ sudo dnf install -y jq
```
> - Setelah instalasi jq selesai, tambahkan jq pada perintah get-students, seperti dibawah ini:
```bash
$ curl -X POST localhost:4000/get-students | jq
```

3. Tambahkan student
```bash
curl --header "Content-Type: application/json" \
	-d '{"nopeserta": 1130360, "name": "Abizhar"}' \
	-X POST localhost:4000/add-student
```
4. Sekali lagi lihat semua student untuk melihat perubahan
```bash
$ curl -X POST localhost:4000/get-students | jq
```
5. Silahkan coba untuk memodifikasi source code dari nodejs app (index.js), build image, run container dan test kembali.

### Queries/Comments

Anda dapat menghubungi saya di xhartono@gmail.com atau menyampaikan komentar atau pertanyaan  melalui /issue.

# Arigato Thank You Matur Nuhun Mauliate
