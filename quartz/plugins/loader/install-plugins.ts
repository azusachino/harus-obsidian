#!/usr/bin/env node
import fs from "fs"
import path from "path"
import YAML from "yaml"
import { installPlugins, parsePluginSource } from "./gitLoader.js"
import { PluginSource, QuartzPluginsJson } from "./types.js"

const CONFIG_YAML_PATH = path.join(process.cwd(), "quartz.config.yaml")
const DEFAULT_CONFIG_YAML_PATH = path.join(process.cwd(), "quartz.config.default.yaml")

function sourceKey(source: PluginSource): string {
  return typeof source === "string" ? source : JSON.stringify(source)
}

function readPluginSources(): PluginSource[] {
  const configPath = fs.existsSync(CONFIG_YAML_PATH) ? CONFIG_YAML_PATH : DEFAULT_CONFIG_YAML_PATH
  if (!fs.existsSync(configPath)) {
    return []
  }

  const raw = fs.readFileSync(configPath, "utf-8")
  const quartzConfig = YAML.parse(raw) as QuartzPluginsJson
  const seen = new Set<string>()
  const sources: PluginSource[] = []

  for (const entry of quartzConfig.plugins ?? []) {
    if (!entry.enabled) continue

    const key = sourceKey(entry.source)
    if (seen.has(key)) continue

    seen.add(key)
    sources.push(entry.source)
  }

  return sources
}

async function main() {
  const externalPlugins = readPluginSources()

  if (externalPlugins.length === 0) {
    console.log("No external plugins to install.")
    return
  }

  console.log(`Installing ${externalPlugins.length} plugin(s) from Git...`)

  const specs = externalPlugins.map((source) => parsePluginSource(source))
  const installed = await installPlugins(specs, { verbose: true })

  if (installed.size === externalPlugins.length) {
    console.log("✓ All plugins installed successfully")
  } else {
    console.error(`✗ Only ${installed.size}/${externalPlugins.length} plugins installed`)
    process.exit(1)
  }
}

main().catch((err) => {
  console.error("Failed to install plugins:", err)
  process.exit(1)
})
