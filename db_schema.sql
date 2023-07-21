
-- This makes sure that foreign_key constraints are observed and that errors will be thrown for violations
PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;


--Yes, editId refers to the article_id in the schema. In the database schema provided, 
-- the table "existArticle" has a primary key column "article_id", which uniquely identifies each article. 
-- When updating the article, the editId variable is used to specify which article in the "existArticle" 
-- table needs to be updated. The editId value is obtained from the URL parameter and is used in the UPDATE query:

CREATE TABLE IF NOT EXISTS existArticle (
    article_id INTEGER PRIMARY KEY AUTOINCREMENT,
    article_title TEXT NOT NULL,
    article_subtitle TEXT NOT NULL,
    article_created TEXT NOT NULL,   -- change data type to TEXT from INT 
    article_last_modified TEXT NOT NULL,    -- change data type to TEXT from INT 
    article_action TEXT NOT NULL
    -- edit_id INTEGER, -- Foreign key reference to editArticle table 
    -- FOREIGN KEY (edit_id) REFERENCES editArticle(edit_id) -- Add foreign key constraint
);

CREATE TABLE IF NOT EXISTS userSetting (
    setting_id INTEGER PRIMARY KEY AUTOINCREMENT, 
    setting_title TEXT NOT NULL, 
    setting_subtitle TEXT NOT NULL, 
    setting_author_name TEXT NOT NULL
);




-- Table for the home page -> under the draft articles 
INSERT OR IGNORE INTO existArticle ("article_title", "article_subtitle", "article_created", "article_last_modified", "article_action" ) 
VALUES ('Michelle Teo', 'This is me', strftime('%Y-%m-%d', 'now'), strftime('%Y-%m-%d %H:%M:%S', 'now'), ' ');
INSERT OR IGNORE INTO existArticle ("article_title", "article_subtitle", "article_created", "article_last_modified", "article_action" ) 
VALUES ('William Low', 'Hello there', strftime('%Y-%m-%d', 'now'), strftime('%Y-%m-%d %H:%M:%S', 'now'), ' ');
INSERT OR IGNORE INTO existArticle ("article_title", "article_subtitle", "article_created", "article_last_modified", "article_action" ) 
VALUES ('Chicken Nugget', 'is very nice to eat', strftime('%Y-%m-%d', 'now'), strftime('%Y-%m-%d %H:%M:%S', 'now'), ' ');


-- Table for the setting page 
INSERT OR IGNORE INTO userSetting ("setting_title", "setting_subtitle", "setting_author_name") 
VALUES ('Adventures in code', 'A beginner journey', 'Michelle Beth');
-- TO AVOID DUPLICATE DATA INTO "SELECT * FROM ..." 

COMMIT;

