all: life.zip

life.zip: life.html
	zip -9 life life.html

life.html: index.html jquery.min.js make_static.pl
	perl make_static.pl $< >$@

jquery.min.js:
	wget -O$@ --no-use-server-timestamps http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js

clean:
	rm life.zip life.html jquery.min.js

.SUFFIXES:
