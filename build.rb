#!/usr/bin/ruby

require "fileutils"
require "sqlite3"
require "json"

docdir  = "FoundationEmail.docset/Contents/Resources/Documents"
dbfile  = "FoundationEmail.docset/Contents/Resources/docSet.dsidx"
newdocs = "../foundation-emails/_build"

# Nuke the existing database & docs
FileUtils.rm_f dbfile
FileUtils.rm_rf docdir

# Copy over docs from Foundation for Email repo
FileUtils.cp_r newdocs, docdir

# Open a database
db = SQLite3::Database.new dbfile

# Create Tables
db.execute "CREATE TABLE searchIndex(id INTEGER PRIMARY KEY, name TEXT, type TEXT, path TEXT);"
db.execute "CREATE UNIQUE INDEX anchor ON searchIndex (name, type, path);"

# JSON File
docmap = JSON.parse(File.read("docmap.json"))

docmap.each {|type,doc| 
	doc.each {|name,path| 
		db.execute "INSERT OR IGNORE INTO searchIndex(name, type, path) VALUES ('#{name}', '#{type}', '#{path}');"
	}
}

db.execute("select * from searchIndex") do |row|
	p row
end