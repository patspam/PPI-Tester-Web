#!/usr/local/bin/perl
use strict;
use warnings;

# Load in the PPI classes
use lib '/home/patspam/perl5/lib/perl5';
use PPI::Lexer  ();
use PPI::Dumper ();
use CGI::Simple;

my $q = new CGI::Simple;
print $q->header();

my $src = $q->param('src');
if ( !$src ) {
    exit;
}

my $lexer    = PPI::Lexer->new;
my $document = $lexer->lex_source($src) or error("Error during lex");
my $dumper   = PPI::Dumper->new( $document, indent => 2 )
    or error("Failed to created PPI::Document dumper");
my $output = $dumper->string() or error("Dumper failed to generate output");

print '<pre>' . $output . '</pre>';

sub error {
    my $s = shift;
    print $s;
    die $s;
}
