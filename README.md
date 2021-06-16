# Menggunakan nodejs-mysql dengan docker

---

## Tujuan Instruksional Khusus

- Menjalankan aplikasi nodejs dengan database mysql menggunakan arsitektur docker dan microservice
- Menjalankan server mysql di docker container.
- Menjalankan aplikasi nodejs sederhana pada docker container yang terpisah.
- Menghubungkan kedua container dan uji integrasi aplikasi mysql-nodejs.

---

## Persyaratan

- docker dan docker-compose sudah terpasang pada Operating System yang digunakan.

---

## Prosedur 1: Menjalankan MySQL Container

----

#### Clone repository

```bash
$ git clone https://github.com/xhartono/lab-nodejs-mysql.git
$ git checkout master
$ tree
.
├── docker-compose.yml
├── mysql
│   ├── Dockerfile
│   └── test-dump.sql
├── nodejs
│   ├── Dockerfile
│   ├── index.js
│   ├── package.json
│   ├── package-lock.json
│   ├── test_connection.js
│   └── wait-for-mysql.sh
├── README.md
└── values.yaml
```

----

#### Lihat Dockerfile untuk membuat docker Image

```bash
$ cd lab-nodejs-mysql/mysql
$ ls
Dockerfile  test-dump.sql
```

> ✍️Catatan:
> - berkas Dockerfile berisi informasi yang digunakan docker untuk membangun image
> - test-dump.sql, berisi perintah sql untuk membuat table dan mengisi dengan dummy data.

----

#### Lihat isi Dockerfile

```bash
$ more Dockerfile
## Pull the mysql:5.7 image
FROM mysql:5.7

## The maintainer name and email
MAINTAINER Inixindo (rbx.inixindo@gmail.com)

# database = test and password for root = password
ENV MYSQL_DATABASE=sistradb \
    MYSQL_ROOT_PASSWORD=inix2021

# when container will be started, we'll have `test` database created with this schema
COPY ./test-dump.sql /docker-entrypoint-initdb.d/
```
----

> :writing_hand:Catatan:
> - FROM: membangun berdasarkan image pada nilai FROM
> - ENV: akan mengisi variable MYSQL_DATABASE dan MYSQL_ROOT_PASSWORD dengan nilai 'test' dan 'password'. Container akan membuat database dengan nama 'test' dan username root dengan password 'inix2021'.
> - COPY: menyalin berkas test-dump.sql pada lokal direktori ke direktori docker-entrypoint-initdb.d pada direktori di image.
> - Berkas test-dump.sql, karena diletakkan pada direktori docker-entrypoint-initdb.d, container dari image mysql:5.7 ini akan otomatis mengeksekusi perintah-perintah yang ada didalam berkas test-dump.sql.
> - Pada saat di run, container akan membuat database dengan nama sistradb, dengan username: root dan password: inix2021
> - Table peserta akan dibuat secara otomatis, dan diisi dengan 2 baris data.

----

#### Membangun docker image

```bash
$ docker images
$ docker build -t tutorial/mysql .
$ docker images
```

----

#### Buat docker Volume untuk mysql data

```bash
$ docker volume create mysql_volume
```

----

#### Jalankan container

```bash
$ docker ps -a
$ docker run \
	-p 3306:3306 \
	-v mysql_volume:/var/lib/mysql \
	--name mysqlku \
	-d tutorial/mysql
$ docker ps -a
```

----

#### Inspeksi Log

```bash
$ docker logs -f mysqlku
```

> :writing_hand:Catatan:
> - Tekan <ctrl-c> untuk keluar dari logs
> - Jika sukses, perhatikan pada log akan terdapat informasi seperti berikut:
```bash
2021-06-16T05:59:40.122523Z 0 [Note] mysqld: ready for connections.
```
> - Lihat apakah terdapat error?
> - Minta bantuan fasilitator jika tidak bisa memperbaiki error.

----

#### Lihat apakah data dummy telah terbentuk pada database

```bash
$ docker exec -t mysqlku \
	mysql -uroot -pinix2021 sistradb -e 'select * from peserta;
```

> ✍️Catatan:
> - -p: diisi dengan password
> - sistradb: nama database yang sebelumnya telah dibuat
> - -e: perintah SQL yang digunakan untuk melihat data pada table peserta
> - table peserta beserta datanya di ciptakan melalui file test-dump.sql pada pembahasan sebelumnya

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
