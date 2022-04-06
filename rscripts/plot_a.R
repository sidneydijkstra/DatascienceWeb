library(DBI)
library(RMySQL)
library(ggplot2)
library(stringr)

mydb = dbConnect(MySQL(),
                 user='pds',
                 password='St0pHack1ngMyDatabase@!',
                 host='82.73.140.46',
                 port = 25565)
moviesafterq = dbSendQuery(mydb, 'SELECT mr.startYear, mr.rating, mr.totalVoteCount
  FROM db_datascience.Country c
   INNER JOIN db_datascience.MovieRating mr
   ON mr.movie_Id = c.movie_Id
  WHERE c.country = "Netherlands" and (mr.startYear like "(199%" or mr.startYear like "(20%")')
dataAfter = fetch(moviesafterq, n=-1)
dbClearResult(moviesafterq)
moviesbeforeq = dbSendQuery(mydb, 'SELECT mr.startYear, mr.rating, mr.totalVoteCount
  FROM db_datascience.Country c
   INNER JOIN db_datascience.MovieRating mr
   ON mr.movie_Id = c.movie_Id
  WHERE c.country = "Netherlands" and not (mr.startYear like "(199%" or mr.startYear like "(20%")')
dataBefore = fetch(moviesbeforeq, n=-1)
dbClearResult(moviesbeforeq)
dbDisconnect(mydb)
yearsAfter = str_extract_all(dataAfter[1], "[0-9]{4}")[[1]]
dataAfter[1] = str_extract_all(dataAfter[1], "[0-9]{4}")[[1]]
dataBefore[1] = str_extract_all(dataBefore[1], "[0-9]{4}")[[1]]
dataAll = data.frame()
dataAll = rbind(dataBefore, dataAfter)
dataAll[1] = lapply(dataAll[1],as.numeric)
qplot(startYear, rating, data = dataAll)
