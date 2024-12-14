INSERT INTO "people" ("peopleID", "familyName", "name") 
  VALUES (1, '磯野', '波平')
  ON CONFLICT ("peopleID")
  DO UPDATE SET "peopleID" = 1, "familyName" = '磯野', "name" = '波平';
INSERT INTO "profile" ("familyID", "peopleID", "isCharge") 
  VALUES (1, 1, true)
  ON CONFLICT ("peopleID")
  DO UPDATE SET "familyID" = 1, "peopleID" = 1, "isCharge" = true;
INSERT INTO "people" ("peopleID", "familyName", "name") 
  VALUES (2, '磯野', 'カツオ')
  ON CONFLICT ("peopleID")
  DO UPDATE SET "peopleID" = 2, "familyName" = '磯野', "name" = 'カツオ';
INSERT INTO "profile" ("familyID", "peopleID", "isCharge") 
  VALUES (1, 2, false)
  ON CONFLICT ("peopleID")
  DO UPDATE SET "familyID" = 1, "peopleID" = 2, "isCharge" = false;