
USE `sistradb`;
DROP TABLE IF EXISTS `peserta`;
CREATE TABLE `peserta` (
  `nopeserta` int(11) AUTO_INCREMENT,
  `nama` varchar(255) DEFAULT NULL,
  `alamat` varchar(255) DEFAULT NULL,
  `kota` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`nopeserta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
LOCK TABLES `peserta` WRITE;
INSERT INTO `peserta` VALUES (1,'Azyva Giselle Kurniawan', 'Ciawi', 'Bogor');
INSERT INTO `peserta` VALUES (2,'Larasati Kirana', 'Permata Hijau', 'Jakarta');
UNLOCK TABLES;
