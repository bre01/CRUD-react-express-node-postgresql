--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3 (Postgres.app)
-- Dumped by pg_dump version 16.3 (Postgres.app)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: users; Type: TABLE; Schema: public; Owner: bre
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character(20),
    email character(30)
);


ALTER TABLE public.users OWNER TO bre;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: bre
--

ALTER TABLE public.users ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: bre
--

COPY public.users (id, name, email) FROM stdin;
1	hello               	fsfs@fsfsfs                   
2	                    	                              
3	react               	express                       
\.


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bre
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- PostgreSQL database dump complete
--

