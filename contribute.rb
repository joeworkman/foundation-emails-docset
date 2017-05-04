#!/usr/bin/ruby

require "fileutils"
require "json"

load "build.rb"

dashdir = "../Dash-User-Contributions/docsets/FoundationEmails"
docset  = JSON.parse(File.read("docset.json"))
archive = "FoundationEmails.tgz"

files = [
	"FoundationEmails.docset/icon.png",
	"FoundationEmails.docset/icon@2x.png",
	"README.md",
	"docset.json",
	archive
]

system "tar --exclude='.DS_Store' -cvzf FoundationEmails.tgz FoundationEmails.docset"

FileUtils.mkdir_p dashdir unless File.exists?(dashdir)

files.each { |file|
	FileUtils.cp file, dashdir
}

version_dir = dashdir+"/versions/"+docset['version']
FileUtils.mkdir_p version_dir unless File.exists?(version_dir)
FileUtils.cp archive, version_dir
