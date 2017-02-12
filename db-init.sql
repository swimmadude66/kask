Create Schema if not exists ontap;
Use `ontap`;

CREATE TABLE IF NOT EXISTS `styles` (
  `StyleId` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(128) NOT NULL,
  `Description` longtext,
  `SRMMin` int(3) DEFAULT NULL,
  `SRMMax` int(3) DEFAULT NULL,
  `IBUMin` int(6) DEFAULT NULL,
  `IBUMax` int(6) DEFAULT NULL,
  `ABVMin` decimal(8,5) DEFAULT NULL,
  `ABVMax` decimal(8,5) DEFAULT NULL,
  `BDBID` varchar(32) NOT NULL,
  PRIMARY KEY (`StyleId`),
  UNIQUE KEY `StyleId_UNIQUE` (`StyleId`),
  UNIQUE KEY `BDBID_UNIQUE` (`BDBID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='More information about a style of beer';

CREATE TABLE IF NOT EXISTS `breweries` (
  `BreweryId` int(11) NOT NULL AUTO_INCREMENT,
  `BreweryName` varchar(128) DEFAULT NULL,
  `Description` longtext,
  `Image` varchar(1024) DEFAULT NULL,
  `Established` varchar(32) DEFAULT NULL,
  `Website` varchar(1024) DEFAULT NULL,
  `BDBID` varchar(32) NOT NULL,
  PRIMARY KEY (`BreweryId`),
  UNIQUE KEY `BreweryId_UNIQUE` (`BreweryId`),
  UNIQUE KEY `BDBID_UNIQUE` (`BDBID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COMMENT='Information about breweries';

CREATE TABLE IF NOT EXISTS `taps` (
  `TapId` int(11) NOT NULL AUTO_INCREMENT,
  `TapName` varchar(128) NOT NULL,
  `Description` varchar(256) DEFAULT NULL,
  `Status` varchar(64) DEFAULT '' COMMENT 'Any special information about the status of the tap. Is it overly frothy? Tart AF? leaky?',
  `KegSize` enum('1/6','1/4','1/2') NOT NULL,
  PRIMARY KEY (`TapId`),
  UNIQUE KEY `TapId_UNIQUE` (`TapId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Available taps go here';

CREATE TABLE IF NOT EXISTS `beers` (
  `BeerId` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(128) NOT NULL,
  `Description` longtext,
  `StyleId` int(11) NOT NULL,
  `BreweryId` int(11) NOT NULL,
  `ABV` decimal(8,5) DEFAULT NULL,
  `IBU` int(6) DEFAULT NULL,
  `LabelUrl` varchar(512) DEFAULT NULL,
  `BDBID` varchar(32) NOT NULL,
  PRIMARY KEY (`BeerId`),
  UNIQUE KEY `BeerId_UNIQUE` (`BeerId`),
  UNIQUE KEY `UN_BeerID_API` (`BrewDBID`),
  KEY `Brewery_idx` (`BreweryId`),
  KEY `Style_idx` (`StyleId`),
  CONSTRAINT `Brewery` FOREIGN KEY (`BreweryId`) REFERENCES `breweries` (`BreweryId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `Style` FOREIGN KEY (`StyleId`) REFERENCES `styles` (`StyleId`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Information about the beers';

CREATE TABLE IF NOT EXISTS `beer_sessions` (
  `SessionId` int(11) NOT NULL,
  `TapId` int(11) NOT NULL,
  `BeerId` int(11) NOT NULL,
  `NumVotes` int(11) DEFAULT NULL,
  `TappedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `Score` varchar(8) DEFAULT NULL,
  `KegSize` enum('1/6','1/4','1/2') DEFAULT NULL,
  `Active` tinyint(1) NOT NULL DEFAULT '1',
  `RemovalTime` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`SessionId`),
  UNIQUE KEY `HistoryId_UNIQUE` (`SessionId`),
  UNIQUE KEY `ActiveBeer` (`TapId`,`Active`) COMMENT 'Only one beer can be active on a given tap at a time',
  KEY `Tap_idx` (`TapId`),
  KEY `Beer_idx` (`BeerId`),
  CONSTRAINT `FK_Beer` FOREIGN KEY (`BeerId`) REFERENCES `beers` (`BeerId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_Tap` FOREIGN KEY (`TapId`) REFERENCES `taps` (`TapId`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Record of beer taptimes';

