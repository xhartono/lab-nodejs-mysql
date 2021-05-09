#!/bin/sh
# wait-for-mysql.sh
# kegunaan: menunggu service mysql selesai, sebelum melanjutkan ke service nodejs

set -e
host="$1"
shift
cmd="$@"

echo $host
echo $cmd

until node test_connection.js; do
    >&2 echo "Service MySQL belum aktif, menunggu.."
    sleep 1
done

>&2 echo "Service MySQL sudah aktif"
exec $cmd