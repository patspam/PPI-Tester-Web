#!/usr/local/bin/perl
use strict;
use warnings;

# Locate the dependencies
# - in my shared hosting account, I use local::lib to 
#   install these, and then symlink 'lib' to the location
#   that local::lib installed them to
use FindBin;
use lib "$FindBin::Bin/lib";

use PPI::Lexer  ();
use PPI::Dumper ();
use CGI::Simple;

my $q = new CGI::Simple;
print $q->header();

my $src      = $q->param('src') or exit;
my $lexer    = PPI::Lexer->new;
my $document = $lexer->lex_source($src) or error("Error during lex");
my $dumper   = PPI::Dumper->new( $document, indent => 2 )
    or error("Failed to created PPI::Document dumper");
my $output   = $dumper->string()
    or error("Dumper failed to generate output");

print "<pre>$output</pre>";

sub error {
    my $s = shift;
    print $s;
    die $s;
}
