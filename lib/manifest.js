
var semver = require('semver');
var guid = require('guid');

var DEFAULT_MIN_SDK = '3.2.0.GA';

// Public API
// ==========

exports.buildFromPackage = buildFromPackage;
exports.buildManifest = buildManifest;
exports.validatePackage = validatePackage;

function validatePackage(package) {
  if (!package.guid) {
    throw new Error("No `guid` found. Here’s one for you: " + guid.raw());
  }
}

function buildFromPackage(package) {
  var authorObj = getAuthorFromPackage(package);

  var version = package.version;
  var description = package.description;
  var author = getAuthorFull(authorObj);
  var license = getLicenseFromPackage(package);
  var copyright = package.copyright || ('Copyright © ' + (new Date).getFullYear() + ' ' + getAuthorName(authorObj));
  var name = package.name;
  var moduleid = package.name;
  var guid = package.guid;
  var platform = 'commonjs';
  var minsdk = getMinSDK(package);

  return buildManifest({
    'version': version,
    'description': description,
    'author': author,
    'license': license,
    'copyright': copyright,
    'name': name,
    'moduleid': moduleid,
    'guid': guid,
    'platform': platform,
    'minsdk': minsdk
  });
}

function buildManifest(data) {
  return Object.keys(data).map(function (key) {
    var value = data[key];
    return key + ':' + (value ? (' ' + value) : '')
  }).join('\n');
}


// Utilities
// =========

function getLicenseFromPackage(package) {
  if (package.license) {
    return licenseToString(package.license);
  }
  else if (package.licenses) {
    return package.licenses.map(licenseToString).join(', ');
  }
}

function licenseToString(license) {
  if (typeof license === 'string') {
    return license;
  }
  else if (typeof license === 'object') {
    return license.type;
  }
  else {
    return '-';
  }
}

function getAuthorFromPackage(package) {
  var author = package.author;
  var contributors = package.contributors;

  if (author) {
    return author;
  }
  else if (contributors && contributors.length) {
    return contributors[0];
  }
  else {
    return {};
  }
}

function getAuthorName(author) {
  if (typeof author === 'string') {
    var pos;
    if ((pos = author.indexOf('<')) >= 0 ||
        (pos = author.indexOf('(')) >= 0) {

      return author.slice(0, pos).trim();
    }
    else {
      return author.tirm();
    }
  }
  else {
    return (author.name || author.email || author.url || '-').trim();
  }
}

function getAuthorFull(author) {
  if (typeof author === 'string') {
    return author;
  }
  else {
    return [
      author.name,
      author.email && ('<' + author.email + '>'),
      author.url && ('(' + author.url + ')')
    ].filter(function (piece) {
      return piece;
    }).join(' ');
  }
}

function getMinSDK(package) {
  try {
    return semver.Range(package.engines.titaniumsdk).set[0][0].semver.format()
  }
  catch (e) {
    return DEFAULT_MIN_SDK;
  }
}

function licenseToString(license) {
  if (typeof license === 'string') {
    return license;
  }
  else if (typeof license === 'object') {
    return license.type;
  }
  else {
    return '-';
  }
}

function identity(o) {
  return o;
}