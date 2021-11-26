CREATE USER me;
CREATE DATABASE api;
GRANT ALL PRIVILEGES ON DATABASE api TO me;
\c api 

--CREATE TABLE users (
--  ID SERIAL PRIMARY KEY,
--  first_name VARCHAR(30) NOT NULL,
--  last_name VARCHAR(30) NOT NULL,
--  subscription_register_date date NOT NULL,
--  subscription_end_date date NOT NULL,
--  email VARCHAR(30)
--);

-- CREATE TABLE IF NOT EXISTS public."games"
-- (
--     id SERIAL primary key,
--     season_id integer NOT NULL,
--     league_id integer NOT NULL,
--     game_id integer NOT NULL UNIQUE,
--     game_date date NOT NULL,
--     home_team_id integer NOT NULL,
--     away_team_id integer NOT NULL
--     -- ht_q1_points integer NOT NULL,
--     -- ht_q2_points integer NOT NULL,
--     -- ht_q3_points integer NOT NULL,
--     -- ht_q4_points integer NOT NULL,
--     -- ht_ot_points integer NOT NULL,
--     -- ht_h1_points integer NOT NULL,
--     -- ht_h2_points integer NOT NULL,
--     -- ht_total_points integer NOT NULL,
--     -- at_q1_points integer NOT NULL,
--     -- at_q2_points integer NOT NULL,
--     -- at_q3_points integer NOT NULL,
--     -- at_q4_points integer NOT NULL,
--     -- at_ot_points integer NOT NULL,
--     -- at_h1_points integer NOT NULL,
--     -- at_h2_points integer NOT NULL,
--     -- at_total_points integer NOT NULL,
--     -- game_total_points integer NOT NULL    
-- );

-- CREATE TABLE IF NOT EXISTS public."analyze_games"
-- (
--     id SERIAL primary key,
--     season_id integer NOT NULL,
--     league_id integer NOT NULL,
--     game_id integer NOT NULL UNIQUE,
--     game_date date NOT NULL,
--     game_time time NOT NULL,
--     home_team_id integer NOT NULL,
--     away_team_id integer NOT NULL
-- );


-- CREATE TABLE IF NOT EXISTS public."analyze_games_formulas"
-- (
--     id SERIAL primary key,
--     season_id integer NOT NULL,
--     league_id integer NOT NULL,
--     analyze_type_id integer NOT NULL,
--     game_type_id integer NOT NULL,
--     F1  integer NOT NULL,
--     F2  integer NOT NULL,
--     F3  integer NOT NULL,
--     F4  integer NOT NULL,
--     F5  integer NOT NULL,
--     F6  integer NOT NULL,
--     F7  integer NOT NULL,
--     F8  integer NOT NULL,
--     F9  integer NOT NULL
-- );


-- CREATE TABLE IF NOT EXISTS public."template_analyze_lines"
-- (
--     id SERIAL primary key,
--     user_id integer NOT NULL UNIQUE,
--     game_id integer NOT NULL UNIQUE,
--     analyze_line integer NOT NULL,
--     analyze_type integer NOT NULL,
--     game_type integer NOT NULL,
--     user_analyze_direction integer NOT NULL,
--     F1_points integer NOT NULL,    
--     F2_points integer NOT NULL,    
--     F3_points integer NOT NULL,    
--     F4_points integer NOT NULL,    
--     F5_points integer NOT NULL,    
--     F6_points integer NOT NULL,    
--     F7_points integer NOT NULL,    
--     F8_points integer NOT NULL,    
--     F9_points integer NOT NULL
-- );

-- CREATE TABLE IF NOT EXISTS public."analyze_lines"
-- (
--     id SERIAL primary key,
--     user_id integer NOT NULL UNIQUE,
--     season_id integer NOT NULL UNIQUE,
--     league_id integer NOT NULL UNIQUE,
--     analyze_line integer NOT NULL,
--     game_points integer NOT NULL,
--     analyze_type integer NOT NULL,
--     game_type integer NOT NULL,
--     F1_points boolean NOT NULL,    
--     F2_points boolean NOT NULL,    
--     F3_points boolean NOT NULL,    
--     F4_points boolean NOT NULL,    
--     F5_points boolean NOT NULL,    
--     F6_points boolean NOT NULL,    
--     F7_points boolean NOT NULL,    
--     F8_points boolean NOT NULL,    
--     F9_points boolean NOT NULL
-- );

-- CREATE TABLE IF NOT EXISTS public."analyze_type"
-- (
--     id SERIAL primary key,
--     name VARCHAR(30) NOT NULL    
-- );

-- CREATE TABLE IF NOT EXISTS public."game_type"
-- (
--     id SERIAL primary key,
--     name VARCHAR(30) NOT NULL    
-- );

-- CREATE TABLE IF NOT EXISTS public."seasons"
-- (
--     id SERIAL primary key,
--     name VARCHAR(20) NOT NULL   
-- );

-- CREATE TABLE IF NOT EXISTS public."leagues"
-- (
--     id SERIAL primary key,
--     name VARCHAR(50) NOT NULL,    
-- );

-- CREATE TABLE IF NOT EXISTS public."teams"
-- (
--     id SERIAL primary key,
--     name VARCHAR(50) NOT NULL
-- );

-- INSERT INTO analyze_type (name)
--   VALUES ('Total'),('First Half'),('Second Half'),('First Quarter'),('Second Quarter'),('Third Quarter'),('Forth Quarter');

-- INSERT INTO game_type (name)
--   VALUES ('All Games'),('Last 5 Games'),('Last 4 Games');

-- INSERT INTO seasons (name)
--   VALUES ('2021'),('2021/2022'),('2022'),('2022/2023');

-- INSERT INTO leagues (name, country_name)
--   VALUES ('Liga A','Argentina'), ('Super 4','Argentina'), ('Torneo Supper 20','Argentina'), ('Super Cup','Argentina');

-- INSERT INTO teams (name)
--   VALUES ('Quimsa'),('San Lorenzo'),('Regatas'),('Boca Juniors');

--INSERT INTO users (name, email)
--  VALUES ('Jerry', 'jerry@example.com'), ('George', 'george@example.com');
