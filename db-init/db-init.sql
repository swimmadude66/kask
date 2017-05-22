Create Schema if not exists ontap;
Use `ontap`;

CREATE TABLE IF NOT EXISTS `users` (
  `UserId` int(11) NOT NULL AUTO_INCREMENT,
  `Email` varchar(100) NOT NULL,
  `Salt` varchar(100) NOT NULL,
  `PasswordHash` varchar(256) NOT NULL,
  `IsAdmin` tinyint(1) NOT NULL DEFAULT '0',
  `Active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`UserId`),
  UNIQUE KEY `Email_UNIQUE` (`Email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `sessions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `SessionId` varchar(128) NOT NULL,
  `UserId` int(11) NOT NULL,
  `Active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`SessionId`),
  UNIQUE KEY `sessionID` (`SessionId`),
  KEY `user_session_idx` (`UserId`),
  KEY `idindex` (`Id`),
  CONSTRAINT `user_session` FOREIGN KEY (`UserId`) REFERENCES `users` (`UserId`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `styles` (
  `StyleId` int(11) NOT NULL AUTO_INCREMENT,
  `StyleName` varchar(128) NOT NULL,
  `StyleDescription` longtext,
  `SRMMin` int(3) DEFAULT NULL,
  `SRMMax` int(3) DEFAULT NULL,
  `IBUMin` int(6) DEFAULT NULL,
  `IBUMax` int(6) DEFAULT NULL,
  `ABVMin` decimal(8,5) DEFAULT NULL,
  `ABVMax` decimal(8,5) DEFAULT NULL,
  `StyleBDBID` varchar(32) NOT NULL,
  PRIMARY KEY (`StyleId`),
  UNIQUE KEY `StyleId_UNIQUE` (`StyleId`),
  UNIQUE KEY `BDBID_UNIQUE` (`StyleBDBID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='More information about a style of beer';

CREATE TABLE IF NOT EXISTS `breweries` (
  `BreweryId` int(11) NOT NULL AUTO_INCREMENT,
  `BreweryName` varchar(128) DEFAULT NULL,
  `BreweryDescription` longtext,
  `Image` varchar(1024) DEFAULT NULL,
  `Established` varchar(32) DEFAULT NULL,
  `Website` varchar(1024) DEFAULT NULL,
  `BreweryBDBID` varchar(32) NOT NULL,
  PRIMARY KEY (`BreweryId`),
  UNIQUE KEY `BreweryId_UNIQUE` (`BreweryId`),
  UNIQUE KEY `BDBID_UNIQUE` (`BreweryBDBID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Information about breweries';

CREATE TABLE IF NOT EXISTS `beers` (
  `BeerId` int(11) NOT NULL AUTO_INCREMENT,
  `BeerName` varchar(128) NOT NULL,
  `BeerDescription` longtext,
  `StyleId` int(11) NOT NULL,
  `BreweryId` int(11) NOT NULL,
  `ABV` decimal(8,5) DEFAULT NULL,
  `IBU` int(6) DEFAULT NULL,
  `LabelUrl` varchar(512) DEFAULT NULL,
  `LabelScalingFactor` int(11) NOT NULL DEFAULT '100',
  `BeerBDBID` varchar(32) NOT NULL,
  PRIMARY KEY (`BeerId`),
  UNIQUE KEY `BeerId_UNIQUE` (`BeerId`),
  UNIQUE KEY `UN_BeerID_API` (`BeerBDBID`),
  KEY `Brewery_idx` (`BreweryId`),
  KEY `Style_idx` (`StyleId`),
  CONSTRAINT `Brewery` FOREIGN KEY (`BreweryId`) REFERENCES `breweries` (`BreweryId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `Style` FOREIGN KEY (`StyleId`) REFERENCES `styles` (`StyleId`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Information about the beers';


CREATE TABLE IF NOT EXISTS `kegs` (
  `KegId` int(11) NOT NULL AUTO_INCREMENT,
  `BeerId` int(11) NOT NULL,
  `Size` enum('1/2','1/3','1/4','1/5','1/6') NOT NULL,
  `RemovedVolume` decimal(10,0) NOT NULL DEFAULT '0',
  PRIMARY KEY (`KegId`),
  KEY `KegContents_idx` (`BeerId`),
  CONSTRAINT `KegContents` FOREIGN KEY (`BeerId`) REFERENCES `beers` (`BeerId`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `taps` (
  `TapId` int(11) NOT NULL AUTO_INCREMENT,
  `TapName` varchar(128) NOT NULL,
  `Description` varchar(256) DEFAULT NULL,
  `Status` varchar(64) DEFAULT NULL COMMENT 'Any special information about the status of the tap. Is it overly frothy? Tart AF? leaky?',
  PRIMARY KEY (`TapId`),
  UNIQUE KEY `TapId_UNIQUE` (`TapId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Available taps go here';

CREATE TABLE IF NOT EXISTS `off_tap_locations` (
  `LocationId` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(256) NOT NULL,
  `Description` longtext,
  PRIMARY KEY (`LocationId`),
  UNIQUE KEY `LocationId_UNIQUE` (`LocationId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Describe locations that are not the current tap. ie cold storage, warm storage, order-list';

CREATE TABLE IF NOT EXISTS `beer_sessions` (
  `SessionId` int(11) NOT NULL AUTO_INCREMENT,
  `TapId` int(11) NOT NULL,
  `KegId` int(11) NOT NULL,
  `TappedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `Active` tinyint(1) NOT NULL DEFAULT '1',
  `RemovalTime` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`SessionId`),
  UNIQUE KEY `HistoryId_UNIQUE` (`SessionId`),
  KEY `Tap_idx` (`TapId`),
  KEY `FK_Keg_idx` (`KegId`),
  CONSTRAINT `FK_Keg` FOREIGN KEY (`KegId`) REFERENCES `kegs` (`KegId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_Tap` FOREIGN KEY (`TapId`) REFERENCES `taps` (`TapId`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Record of beer taptimes';

CREATE TABLE IF NOT EXISTS `beer_session_likes` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `BeerSessionId` int(11) NOT NULL,
  `UserId` int(11) NOT NULL,
  `Vote` enum('down','none','up') NOT NULL DEFAULT 'none',
  PRIMARY KEY (`Id`),
  UNIQUE KEY `oneVote` (`BeerSessionId`,`UserId`),
  KEY `bsession_idx` (`BeerSessionId`),
  KEY `uservotes_idx` (`UserId`),
  CONSTRAINT `bsession` FOREIGN KEY (`BeerSessionId`) REFERENCES `beer_sessions` (`SessionId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `uservotes` FOREIGN KEY (`UserId`) REFERENCES `users` (`UserId`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `keg_locations` (
  `KegLocId` int(11) NOT NULL AUTO_INCREMENT,
  `LocationId` int(11) NOT NULL,
  `KegId` int(11) NOT NULL,
  `EnteredStorage` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`KegLocId`),
  UNIQUE KEY `KegId_UNIQUE` (`KegLocId`),
  KEY `FK_Location_idx` (`LocationId`),
  KEY `FK_Keg_idx` (`KegId`),
  CONSTRAINT `FK_Kegs` FOREIGN KEY (`KegId`) REFERENCES `kegs` (`KegId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_Location` FOREIGN KEY (`LocationId`) REFERENCES `off_tap_locations` (`LocationId`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Map beers to their off-tap locations';

CREATE TABLE IF NOT EXISTS `pours` (
  `PourId` int(11) NOT NULL AUTO_INCREMENT,
  `KegId` int(11) NOT NULL,
  `Volume` decimal(10,0) NOT NULL DEFAULT '0',
  `Timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`PourId`),
  UNIQUE KEY `PourId_UNIQUE` (`PourId`),
  KEY `pourfromkeg_idx` (`KegId`),
  CONSTRAINT `pourfromkeg` FOREIGN KEY (`KegId`) REFERENCES `kegs` (`KegId`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


