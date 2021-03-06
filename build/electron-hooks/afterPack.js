const promisify = require('util').promisify
const fs = require('fs')
const path = require('path')
const mkdir = promisify(fs.mkdir)
const cp = promisify(fs.copyFile)
const exists = promisify(fs.exists)

exports.default = async function(context) {
    const { appOutDir, outDir, electronPlatformName: platform } = context
    const arch = ['x64', 'arm'][context.arch - 1]  

    const pluginsDir = path.join(outDir, '../../../plugins')
    const toolsDir = path.join(outDir, '../../../tools')
    const libsDir = path.join(outDir, '../../../libs', `${platform}-${arch}`)

    //copy mpv plugin
    const mpvPluginName = `mpv-${platform}-${arch}`
    const mpvPluginPath = path.join(pluginsDir, mpvPluginName)

    if(await exists(mpvPluginPath)) {
        const appOutPluginDir = path.join(appOutDir, 'plugins')

        if(!await exists(appOutPluginDir))
            await mkdir(appOutPluginDir)
        
        await cp(mpvPluginPath, path.join(appOutPluginDir, mpvPluginName))
    }

    //copy lib mpv
    const libMpvName = platform == 'win32'? 'mpv-1.dll' : 'libmpv.so.1'
    const libMpvPath = path.join(libsDir, libMpvName)

    if(await exists(libMpvPath)) {
        await cp(libMpvPath, path.join(appOutDir, libMpvName))
    }

    //copy ffmpeg and ffprobe
    const exeEnding = platform == 'win32'?'.exe':''
    const ffmpegName = `${platform}-${arch}-ffmpeg${exeEnding}`
    const ffprobeName = `${platform}-${arch}-ffprobe${exeEnding}`
    const ffmpegPath = path.join(toolsDir, ffmpegName)
    const ffprobePath = path.join(toolsDir, ffprobeName)

    if(await exists(ffmpegPath) && await exists(ffprobePath)) {
        const appOutToolsDir = path.join(appOutDir, 'tools')

        if(!await exists(appOutToolsDir))
            await mkdir(appOutToolsDir)

        await cp(ffmpegPath, path.join(appOutToolsDir, ffmpegName))
        await cp(ffprobePath, path.join(appOutToolsDir, ffprobeName))
    }
}