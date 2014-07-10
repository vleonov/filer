ALTER TABLE `filer_files` ADD COLUMN `sorting` INT;
UPDATE `filer_files` SET `sorting` = `id`;
ALTER TABLE `filer_files` MODIFY COLUMN `sorting` INT NOT NULL;