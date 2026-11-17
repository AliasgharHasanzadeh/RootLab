import { TerminalCommandDef, TerminalOutputLine } from '../types';

const line = (type: TerminalOutputLine['type'], text: string): TerminalOutputLine => ({
  id: `${Date.now()}-${Math.random()}`,
  type,
  text,
});

const files: Record<string, string> = {
  'README.md': 'Welcome to the rootLab-theDoc simulated terminal!\nThis browser lab uses mock data for learning.',
  'notes.txt': 'Linux, networking, and cybersecurity practice notes.',
  'greeting.txt': 'Welcome to RootLab Docs!',
};

export const COMMAND_REGISTRY: Record<string, TerminalCommandDef> = {
  help: { name: 'help', summary: 'Show supported commands', usage: 'help', category: 'core', execute: () => [line('stdout', Object.keys(COMMAND_REGISTRY).join('  '))] },
  ls: { name: 'ls', summary: 'List files in the mock workspace', usage: 'ls [-la]', category: 'core', execute: (args) => [line('stdout', args.includes('-la') ? 'total 12\ndrwxr-xr-x  student student 4096 .\n-rw-r--r--  student student  112 README.md\n-rw-r--r--  student student   55 notes.txt\n-rw-r--r--  student student   24 greeting.txt' : 'README.md  notes.txt  greeting.txt')] },
  pwd: { name: 'pwd', summary: 'Print the current directory', usage: 'pwd', category: 'core', execute: () => [line('stdout', '/home/student/workspace')] },
  whoami: { name: 'whoami', summary: 'Show the current user', usage: 'whoami', category: 'core', execute: () => [line('stdout', 'student')] },
  date: { name: 'date', summary: 'Display a sample date', usage: 'date', category: 'core', execute: () => [line('stdout', new Date().toUTCString())] },
  echo: { name: 'echo', summary: 'Display a line of text', usage: 'echo [text...]', category: 'core', execute: (args) => [line('stdout', args.join(' '))] },
  cat: { name: 'cat', summary: 'Display a mock file', usage: 'cat <filename>', category: 'core', execute: (args) => args[0] && files[args[0]] ? files[args[0]].split('\n').map((text) => line('stdout', text)) : [line('stderr', `cat: ${args[0] || 'missing file'}: No such file or directory`)] },
  clear: { name: 'clear', summary: 'Clear the terminal screen', usage: 'clear', category: 'core', execute: () => [] },
  history: { name: 'history', summary: 'Show recent commands', usage: 'history', category: 'core', execute: () => [line('stdout', '1  help\n2  ls -la\n3  pwd')] },
  ping: { name: 'ping', summary: 'Show sample reachability output', usage: 'ping <host>', category: 'network', execute: (args) => [line('stdout', `PING ${args[0] || 'example.com'} (93.184.216.34): 56 data bytes`), line('stdout', '64 bytes from 93.184.216.34: icmp_seq=1 ttl=56 time=18.4 ms'), line('success', '--- sample: 1 packet transmitted, 1 received ---')] },
  ip: { name: 'ip', summary: 'Inspect mock network interfaces', usage: 'ip addr', category: 'network', execute: () => [line('stdout', '1: lo: <LOOPBACK,UP> mtu 65536'), line('stdout', '    inet 127.0.0.1/8 scope host lo'), line('stdout', '2: eth0: <BROADCAST,UP> mtu 1500'), line('stdout', '    inet 192.168.1.25/24 scope global eth0')] },
  nslookup: { name: 'nslookup', summary: 'Resolve a sample domain', usage: 'nslookup <domain>', category: 'network', execute: (args) => [line('info', `Server:  192.168.1.1`), line('stdout', `Name:    ${args[0] || 'example.com'}`), line('stdout', 'Address: 93.184.216.34')] },
  dig: {
    name: 'dig', summary: 'Inspect a sample DNS response', usage: 'dig <domain>', category: 'network',
    execute: (args) => {
      const domain = args[0] || 'example.com';
      return [line('info', '; DiG sample: ' + domain), line('stdout', ';; ANSWER SECTION:'), line('stdout', domain + '.  300  IN  A  93.184.216.34')];
    },
  },
  curl: {
    name: 'curl', summary: 'Display a sample HTTP response', usage: 'curl <url>', category: 'network',
    execute: (args) => {
      const url = args[0] || 'https://example.com';
      return [line('info', 'Sample response for ' + url), line('stdout', '<html><title>Example Domain</title></html>')];
    },
  },
  nmap: { name: 'nmap', summary: 'Read a controlled sample scan', usage: 'nmap [options] <target>', category: 'recon', execute: (args) => [line('info', `Sample scan report for ${args.at(-1) || '192.168.1.1'}`), line('stdout', 'PORT     STATE SERVICE'), line('stdout', '22/tcp   open  ssh'), line('stdout', '80/tcp   open  http')] },
  whois: { name: 'whois', summary: 'Read sample registration data', usage: 'whois <domain>', category: 'recon', execute: (args) => [line('stdout', `Domain Name: ${(args[0] || 'example.com').toUpperCase()}`), line('stdout', 'Registrar: Example Registrar (sample data)'), line('stdout', 'Status: client update prohibited')] },
  uname: { name: 'uname', summary: 'Show mock system information', usage: 'uname [-a]', category: 'system', execute: (args) => [line('stdout', args.includes('-a') ? 'Linux cybervault-sandbox 6.6.0 x86_64 GNU/Linux' : 'Linux')] },
  id: { name: 'id', summary: 'Show mock user and group IDs', usage: 'id', category: 'system', execute: () => [line('stdout', 'uid=1000(student) gid=1000(student) groups=1000(student),27(sudo)')] },
  uptime: { name: 'uptime', summary: 'Show mock system uptime', usage: 'uptime', category: 'system', execute: () => [line('stdout', ' 10:15:00 up 3 days,  2:14,  1 user,  load average: 0.08, 0.11, 0.09')] },
  chmod: { name: 'chmod', summary: 'Show a simulated permission change', usage: 'chmod <mode> <file>', category: 'system', execute: (args) => [line('success', `Permissions for ${args[1] || 'file'} updated to ${args[0] || '644'} (sample only).`)] },
};

export const SAMPLE_PROMPTS = ['ls -la', 'ip addr', 'ping example.com', 'dig example.com', 'nmap -sV 192.168.1.1'];

export function executeCommandString(commandLine: string): TerminalOutputLine[] {
  const parts = commandLine.match(/(?:[^\s"']+|"[^\"]*"|'[^']*')+/g) || [];
  if (!parts.length) return [];
  const command = parts[0].toLowerCase();
  const args = parts.slice(1).map((arg) => arg.replace(/^("|')|("|')$/g, ''));
  const definition = COMMAND_REGISTRY[command];
  return definition ? definition.execute(args, commandLine) : [line('stderr', `bash: ${command}: command not found`), line('info', 'Type "help" to see supported simulation commands.')];
}
