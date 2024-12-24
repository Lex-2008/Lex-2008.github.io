title=Check for running Opera on Windows
uuid=193d9b21-8396-4260-a107-0106b0e6ec35
PROCESSOR=Markdown.pl
intro=Currently (Opera 15-18), when you start Opera on Windows, it spawns itself again and terminates the process you started — so you can't easily wait until the Opera you've started quit. Or can you?
tags=opera python windows
created=2013-09-23
modified=2013-09-23
modified_now=1

<div>

<p>That's how we'll cheat the system: instead of watching after a process with given pid, we'll be watching after a process started from a given folder. And to do this, we'll use <a href="http://msdn.microsoft.com/en-us/library/windows/desktop/ms682629(v=vs.85).aspx">GetModuleFileNameEx function</a>. Sample python code (based on <a href="http://code.activestate.com/recipes/305279-getting-process-information-on-windows/">work by Eric Koome</a>):</p>

<pre>from ctypes import *

def EnumProcesses():
	"""
	Based on work by Eric Koome (ekoome@yahoo.com) - license GPL or PSF:
	http://code.activestate.com/recipes/305279-getting-process-information-on-windows/
	"""
	psapi = windll.psapi #PSAPI.DLL
	kernel = windll.kernel32 #Kernel32.DLL
	arr = c_ulong * 256
	lpidProcess= arr()
	cb = sizeof(lpidProcess)
	cbNeeded = c_ulong()
	hModule = c_ulong()
	count = c_ulong()
	modname = c_buffer(300)
	PROCESS_QUERY_INFORMATION = 0x0400
	PROCESS_VM_READ = 0x0010
	ret = []
	#Call Enumprocesses to get hold of process id's
	psapi.EnumProcesses(byref(lpidProcess), cb, byref(cbNeeded))
	#Number of processes returned
	nReturned = cbNeeded.value/sizeof(c_ulong())
	#Drop unused returned values
	pidProcess = [i for i in lpidProcess][:nReturned]
	for pid in pidProcess:
		#Get handle to the process based on PID
		hProcess = kernel.OpenProcess(PROCESS_QUERY_INFORMATION | PROCESS_VM_READ, False, pid)
		if not hProcess:
			continue
		#Get filename
		psapi.GetModuleFileNameExA(hProcess, None, modname, sizeof(modname))
		kernel.CloseHandle(hProcess)
		if modname.value == '?':
			continue
		ret.append(modname.value)
	#Clean up
	modname.value = '0'
	return ret

if __name__ == '__main__':
	print '\n'.join(EnumProcesses())
</pre>

<p>Run like this — and it prints full pathnames of all processes it could enumerate.<br><br>You can also import this file as a module and search in output of EnumProcesses() function (it's a list) for a process started from given folder (given that above code saved to a file process_lister.py):</p>

<pre>import time

from process_lister import EnumProcesses

process_location = 'C:\Program Files (x86)\Opera'

while True:
	procs = EnumProcesses()
	found = len(filter(lambda proc: proc.startswith(process_location), procs)) &gt; 0
	if not found:
		exit()
	time.sleep(1)
</pre>
<p>Note that since in above code process_location does <strong>not</strong> have terminating <tt>\</tt>, it will wait for Operas in all folders, including, for example, both <tt>C:\Program Files (x86)\Opera Next</tt> and <tt>C:\Program Files (x86)\Opera My</tt></p>

<p>Or you can do some other stuff. Feel free to reuse this code however original license (GPL or PSF) allows you, and feel free to drop me a line, if you think your comment will be interesting for me!</p>

<script src="/microlight.js"></script>
<script>microlight.reset('pre')</script>
</div>
