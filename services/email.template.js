const fs = require('fs');
const path = require('path');

const TEMPLATE_PATH = path.join(__dirname, '..', 'docs', 'VERIFY_EMAIL.md');

let rawTemplate = '';
try {
  rawTemplate = fs.readFileSync(TEMPLATE_PATH, 'utf8');
  // strip triple-backtick fences if present (file is a markdown codeblock)
  rawTemplate = rawTemplate.replace(/^```[^\n]*\n/, '').replace(/\n```\s*$/,'').trim();
} catch (e) {
  rawTemplate = '';
}

const renderVerifyEmail = (verifyUrl) => {
  if (!rawTemplate) {
    // fallback to simple html
    return `<p>Please verify your email by clicking <a href="${verifyUrl}">this link</a>.</p>`;
  }

  // Replace all hrefs and any textual copy of previous example URL with the provided verifyUrl
  let html = rawTemplate.replace(/href="[^\"]*verify-email[^\"]*"/g, `href="${verifyUrl}"`);
  html = html.replace(/https?:\/\/[^\s\"']*verify-email[^\s\"']*/g, verifyUrl);
  // Also replace any occurrences of the URL shown as text inside the template
  html = html.replace(/>https?:\/\/[^<]*verify-email[^<]*</g, `>${verifyUrl}<`);
  return html;
};

module.exports = {
  renderVerifyEmail
};
