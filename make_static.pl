#!/usr/bin/perl

use strict;

while(<>) {
	if (m/<script\s+src="([^"]+)"/) { # "
		my $name = $1;
		warn "Fullname $name\n";
		$name =~ s-.*/--;
		warn "Shortname $name\n";
		open FH, "<$name" or die $!;
		my $data = join("", <FH>);
		$_ = "<script>\n$data\n</script>\n";
	} elsif (m/<link.*?href="([^"]+)"/) { # "
		warn "CSS: $1\n";
		if ($1 =~ /favicon/) {
			next;
		}
		open FH, "<$1" or die $!;
		my $data = join("", <FH>);
		$_ = "<style>\n$data\n</style>\n"
	} elsif (m/<img\s+/) {
		next;
	} elsif (m/<p><a\s/) {
		next;
	}
	print;
}
