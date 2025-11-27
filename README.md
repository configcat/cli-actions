# ConfigCat CLI GitHub Actions

This repository contains [ConfigCat CLI](https://configcat.com/docs/advanced/cli) related [GitHub Actions](https://github.com/features/actions) that you can use in your workflows.

List of available actions:

- [Install CLI](#install-cli)
- [Evaluate feature flags](#evaluate-feature-flags)

## Install CLI

This action installs the ConfigCat CLI for a job in your workflow, so you can use it in subsequent steps.

```yaml
name: Workflow with ConfigCat CLI
on: push
jobs:
  example-job:
    runs-on: ubuntu-latest
    env: 
      CONFIGCAT_API_USER: ${{ secrets.CONFIGCAT_API_USER }}
      CONFIGCAT_API_PASS: ${{ secrets.CONFIGCAT_API_PASS }}
    steps:
      - uses: configcat/cli-actions@v1
      
      # Using the CLI in other steps
      - name: Update feature flag value
        run: configcat flag-v2 value update --flag-id <flag-id> --environment-id <environment-id> --flag-value true          
```

## Evaluate feature flags

This action can evaluate ConfigCat feature flags whose result you can use in your workflow.

```yaml
name: Evaluate ConfigCat feature flags
on: push
jobs:
  example-job:
    runs-on: ubuntu-latest
    steps:
      - name: Evaluate feature flags
        id: flags
        uses: configcat/cli-actions/eval-flag@v1
        with:
          sdk-key: ${{ secrets.SDK_KEY }}
          flag-keys: |
            flag1
            flag2
      
      - name: Step depending on flag1
        if: steps.flags.outputs.flag1 == 'true'
        run: echo "flag1 is true"

      - name: Step depending on flag2
        if: steps.flags.outputs.flag2 == 'true'
        run: echo "flag2 is true"
```

The results of the flag evaluations are stored in the step outputs named with each flag's key.

### Available Options

| Parameter        | Description                                                                                                | Required   | Default             |
| ---------------- | ---------------------------------------------------------------------------------------------------------- | ---------- | ------------------- |
| `sdk-key`        | SDK key identifying the config to download, also loaded from the `CONFIGCAT_SDK_KEY` environment variable  |            |                     |
| `flag-keys`      | List of feature flag keys to evaluate. Multiple values must be in separate lines.                          | &#9745;    |                     |
| `user-attributes` | List of user attributes used for evaluation. Multiple values must be in separate lines in the following format: `<key>:<value>`. Dedicated User Object attributes are mapped like the following: Identifier => id, Email => email, Country => country. |            |                     |
| `base-url`       | The CDN base url from where the CLI will download the config JSON.                                         |            | ConfigCat CDN servers. |
| `data-governance` | Describes the location of your feature flag and setting data within the ConfigCat CDN. Possible values: `eu`, `global`.  |            | `global`                   |
| `verbose`        | Turns on detailed logging.                                                 |            | false               |

## Need help?
https://configcat.com/support

## Contributing
Contributions are welcome. For more info please read the [Contribution Guideline](CONTRIBUTING.md).

## About ConfigCat
ConfigCat is a feature flag and configuration management service that lets you separate releases from deployments. You can turn your features ON/OFF using <a href="https://app.configcat.com" target="_blank">ConfigCat Dashboard</a> even after they are deployed. ConfigCat lets you target specific groups of users based on region, email or any other custom user attribute.

ConfigCat is a <a href="https://configcat.com" target="_blank">hosted feature flag service</a>. Manage feature toggles across frontend, backend, mobile, desktop apps. <a href="https://configcat.com" target="_blank">Alternative to LaunchDarkly</a>. Management app + feature flag SDKs.

- [Documentation](https://configcat.com/docs)
- [ConfigCat](https://configcat.com)
- [Blog](https://configcat.com/blog)
