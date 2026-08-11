import type {
	IDataObject,
	IExecuteFunctions,
	INode,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

import * as semver from 'semver';

function toPlainSemVer(parsed: semver.SemVer | null): IDataObject | null {
	if (!parsed) {
		return null;
	}

	const json: IDataObject = {
		version: parsed.version,
		major: parsed.major,
		minor: parsed.minor,
		patch: parsed.patch,
	};

	if (parsed.prerelease.length > 0) {
		json.prerelease = [...parsed.prerelease];
	}

	if (parsed.build.length > 0) {
		json.build = [...parsed.build];
	}

	if (parsed.raw !== parsed.version) {
		json.raw = parsed.raw;
	}

	return json;
}

/** 标量/数组包一层 value；对象结果直接作为 json */
function toOutputJson(value: unknown): IDataObject {
	if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
		return value as IDataObject;
	}

	return { value: value as IDataObject[keyof IDataObject] };
}

function requireValue<T>(
	value: T | null | undefined,
	message: string,
	node: INode,
	itemIndex: number,
): T {
	if (value === null || value === undefined) {
		throw new NodeOperationError(node, message, { itemIndex });
	}

	return value;
}

export class Semver implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Semver',
		name: 'semver',
		icon: 'file:semver.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ":" + $parameter["resource"]}}',
		description: 'Semantic Versioning utilities for version management',
		defaults: {
			name: 'Semver',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Cleaning',
						value: 'cleaning',
						description: 'Clean and normalize versions',
					},
					{
						name: 'Coercion',
						value: 'coercion',
						description: 'Coerce strings to semver format',
					},
					{
						name: 'Comparison',
						value: 'comparison',
						description: 'Compare version numbers',
					},
					{
						name: 'Increment',
						value: 'increment',
						description: 'Increment version numbers',
					},
					{
						name: 'Parsing',
						value: 'parsing',
						description: 'Parse version components',
					},
					{
						name: 'Range',
						value: 'range',
						description: 'Work with version ranges',
					},
					{
						name: 'Sorting',
						value: 'sorting',
						description: 'Sort version arrays',
					},
					{
						name: 'Validation',
						value: 'validation',
						description: 'Validate and parse versions',
					},
				],
				default: 'validation',
			},

			// Validation Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['validation'],
					},
				},
				options: [
					{
						name: 'Valid',
						value: 'valid',
						description: 'Check if a version string is valid',
						action: 'Check if version is valid',
					},
					{
						name: 'Clean',
						value: 'clean',
						description: 'Clean a version string',
						action: 'Clean version string',
					},
				],
				default: 'valid',
			},

			// Comparison Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['comparison'],
					},
				},
				options: [
					{
						name: 'Compare',
						value: 'compare',
						description: 'Compare two versions (-1, 0, 1)',
						action: 'Compare two versions',
					},
					{
						name: 'Compare Build',
						value: 'compareBuild',
						description: 'Compare versions including build metadata',
						action: 'Compare versions with build metadata',
					},
					{
						name: 'Compare Loose',
						value: 'compareLoose',
						description: 'Compare versions with loose parsing',
						action: 'Compare versions loosely',
					},
					{
						name: 'Diff',
						value: 'diff',
						description: 'Get difference between versions',
						action: 'Get version difference',
					},
					{
						name: 'Equal',
						value: 'eq',
						description: 'Check if version1 == version2',
						action: 'Check if versions are equal',
					},
					{
						name: 'Greater Than',
						value: 'gt',
						description: 'Check if version1 > version2',
						action: 'Check if version is greater than',
					},
					{
						name: 'Greater Than or Equal',
						value: 'gte',
						description: 'Check if version1 >= version2',
						action: 'Check if version is greater than or equal',
					},
					{
						name: 'Less Than',
						value: 'lt',
						description: 'Check if version1 < version2',
						action: 'Check if version is less than',
					},
					{
						name: 'Less Than or Equal',
						value: 'lte',
						description: 'Check if version1 <= version2',
						action: 'Check if version is less than or equal',
					},
					{
						name: 'Not Equal',
						value: 'neq',
						description: 'Check if version1 != version2',
						action: 'Check if versions are not equal',
					},
					{
						name: 'Reverse Compare',
						value: 'rcompare',
						description: 'Reverse compare two versions',
						action: 'Reverse compare two versions',
					},
				],
				default: 'gt',
			},

			// Range Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['range'],
					},
				},
				options: [
					{
						name: 'Greater Than Range',
						value: 'gtr',
						description: 'Check if version is greater than range',
						action: 'Check if version is greater than range',
					},
					{
						name: 'Intersects',
						value: 'intersects',
						description: 'Check if ranges intersect',
						action: 'Check if ranges intersect',
					},
					{
						name: 'Less Than Range',
						value: 'ltr',
						description: 'Check if version is less than range',
						action: 'Check if version is less than range',
					},
					{
						name: 'Max Satisfying',
						value: 'maxSatisfying',
						description: 'Get highest version satisfying range',
						action: 'Get max satisfying version',
					},
					{
						name: 'Min Satisfying',
						value: 'minSatisfying',
						description: 'Get lowest version satisfying range',
						action: 'Get min satisfying version',
					},
					{
						name: 'Min Version',
						value: 'minVersion',
						description: 'Get minimum version that satisfies range',
						action: 'Get minimum version from range',
					},
					{
						name: 'Outside Range',
						value: 'outside',
						description: 'Check if version is outside range',
						action: 'Check if version is outside range',
					},
					{
						name: 'Satisfies',
						value: 'satisfies',
						description: 'Check if version satisfies range',
						action: 'Check if version satisfies range',
					},
					{
						name: 'Simplify Range',
						value: 'simplifyRange',
						description: 'Simplify a range for given versions',
						action: 'Simplify version range',
					},
					{
						name: 'Subset',
						value: 'subset',
						description: 'Check if range is subset of another',
						action: 'Check if range is subset',
					},
					{
						name: 'To Comparators',
						value: 'toComparators',
						description: 'Convert range to comparators',
						action: 'Convert range to comparators',
					},
					{
						name: 'Valid Range',
						value: 'validRange',
						description: 'Check if range is valid',
						action: 'Check if range is valid',
					},
				],
				default: 'satisfies',
			},

			// Increment Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['increment'],
					},
				},
				options: [
					{
						name: 'Increment',
						value: 'inc',
						description: 'Increment version by release type',
						action: 'Increment version',
					},
				],
				default: 'inc',
			},

			// Parsing Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['parsing'],
					},
				},
				options: [
					{
						name: 'Major',
						value: 'major',
						description: 'Get major version number',
						action: 'Get major version',
					},
					{
						name: 'Minor',
						value: 'minor',
						description: 'Get minor version number',
						action: 'Get minor version',
					},
					{
						name: 'Parse',
						value: 'parse',
						description: 'Parse version string to SemVer object',
						action: 'Parse version string',
					},
					{
						name: 'Patch',
						value: 'patch',
						description: 'Get patch version number',
						action: 'Get patch version',
					},
					{
						name: 'Prerelease',
						value: 'prerelease',
						description: 'Get prerelease components',
						action: 'Get prerelease components',
					},
				],
				default: 'parse',
			},

			// Cleaning Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['cleaning'],
					},
				},
				options: [
					{
						name: 'Clean',
						value: 'clean',
						description: 'Clean version string',
						action: 'Clean version string',
					},
				],
				default: 'clean',
			},

			// Coercion Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['coercion'],
					},
				},
				options: [
					{
						name: 'Coerce',
						value: 'coerce',
						description: 'Coerce string to semver',
						action: 'Coerce to semver',
					},
				],
				default: 'coerce',
			},

			// Sorting Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['sorting'],
					},
				},
				options: [
					{
						name: 'Sort',
						value: 'sort',
						description: 'Sort versions in ascending order',
						action: 'Sort versions ascending',
					},
					{
						name: 'Reverse Sort',
						value: 'rsort',
						description: 'Sort versions in descending order',
						action: 'Sort versions descending',
					},
				],
				default: 'sort',
			},

			// Version input (single version operations)
			{
				displayName: 'Version',
				name: 'version',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['validation', 'cleaning', 'coercion', 'parsing', 'increment'],
					},
				},
				default: '',
				placeholder: '1.2.3',
				description: 'The version string to process',
			},

			// Version1 input (comparison operations)
			{
				displayName: 'Version 1',
				name: 'version1',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['comparison'],
					},
				},
				default: '',
				placeholder: '1.2.3',
				description: 'The first version to compare',
			},

			// Version2 input (comparison operations)
			{
				displayName: 'Version 2',
				name: 'version2',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['comparison'],
					},
				},
				default: '',
				placeholder: '1.2.4',
				description: 'The second version to compare',
			},

			// Version for range operations
			{
				displayName: 'Version',
				name: 'version',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['range'],
						operation: ['satisfies', 'gtr', 'ltr', 'outside'],
					},
				},
				default: '',
				placeholder: '1.2.3',
				description: 'The version to check against range',
			},

			// Range input
			{
				displayName: 'Range',
				name: 'range',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['range'],
						operation: [
							'satisfies',
							'validRange',
							'maxSatisfying',
							'minSatisfying',
							'minVersion',
							'gtr',
							'ltr',
							'outside',
							'simplifyRange',
						],
					},
				},
				default: '',
				placeholder: '^1.2.0',
				description: 'The version range string',
			},

			// Range1 input
			{
				displayName: 'Range 1',
				name: 'range1',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['range'],
						operation: ['intersects', 'subset'],
					},
				},
				default: '',
				placeholder: '^1.2.0',
				description: 'The first range',
			},

			// Range2 input
			{
				displayName: 'Range 2',
				name: 'range2',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['range'],
						operation: ['intersects', 'subset'],
					},
				},
				default: '',
				placeholder: '^1.3.0',
				description: 'The second range',
			},

			// Versions array input
			{
				displayName: 'Versions',
				name: 'versions',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['range', 'sorting'],
						operation: ['maxSatisfying', 'minSatisfying', 'simplifyRange', 'sort', 'rsort'],
					},
				},
				default: '',
				placeholder: '1.2.3,1.2.4,1.3.0',
				description: 'Comma-separated list of versions',
			},

			// Release type for increment
			{
				displayName: 'Release Type',
				name: 'releaseType',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['increment'],
					},
				},
				options: [
					{
						name: 'Major',
						value: 'major',
					},
					{
						name: 'Minor',
						value: 'minor',
					},
					{
						name: 'Patch',
						value: 'patch',
					},
					{
						name: 'Pre-major',
						value: 'premajor',
					},
					{
						name: 'Pre-minor',
						value: 'preminor',
					},
					{
						name: 'Pre-Patch',
						value: 'prepatch',
					},
					{
						name: 'Prerelease',
						value: 'prerelease',
					},
					{
						name: 'Release',
						value: 'release',
					},
				],
				default: 'patch',
				description: 'The type of version increment',
			},

			// Identifier for prerelease
			{
				displayName: 'Prerelease Identifier',
				name: 'identifier',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['increment'],
						releaseType: ['premajor', 'preminor', 'prepatch', 'prerelease'],
					},
				},
				default: 'alpha',
				placeholder: 'alpha',
				description: 'Identifier for prerelease versions',
			},

			// Identifier Base for prerelease
			{
				displayName: 'Identifier Base',
				name: 'identifierBase',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['increment'],
						releaseType: ['premajor', 'preminor', 'prepatch', 'prerelease'],
					},
				},
				options: [
					{
						name: '0 (Zero-Based)',
						value: '0',
					},
					{
						name: '1 (One-Based)',
						value: '1',
					},
					{
						name: 'False (No Number)',
						value: 'false',
					},
				],
				default: '0',
				description: 'Base for prerelease identifier numbering',
			},

			// Hilo for outside operation
			{
				displayName: 'Direction',
				name: 'hilo',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['range'],
						operation: ['outside'],
					},
				},
				options: [
					{
						name: 'Higher (>)',
						value: '>',
					},
					{
						name: 'Lower (<)',
						value: '<',
					},
				],
				default: '>',
				description: 'Direction to check if version is outside range',
			},

			// Options
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Loose',
						name: 'loose',
						type: 'boolean',
						default: false,
						description: 'Whether to use loose parsing for version strings',
					},
					{
						displayName: 'Include Prerelease',
						name: 'includePrerelease',
						type: 'boolean',
						default: false,
						description: 'Whether to include prerelease versions in range matching',
					},
					{
						displayName: 'RTL (Right to Left)',
						name: 'rtl',
						type: 'boolean',
						displayOptions: {
							show: {
								'/resource': ['coercion'],
							},
						},
						default: false,
						description: 'Whether to coerce version strings right to left',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;
				const options = this.getNodeParameter('options', i) as IDataObject;

				let json: IDataObject;

				switch (resource) {
					case 'validation':
						if (operation === 'valid') {
							const version = this.getNodeParameter('version', i) as string;
							// 校验类操作：返回是否合法，不把 null 当成功结果
							json = toOutputJson(semver.valid(version, options) !== null);
						} else if (operation === 'clean') {
							const version = this.getNodeParameter('version', i) as string;
							json = toOutputJson(
								requireValue(
									semver.clean(version, options),
									`Invalid version: ${version}`,
									this.getNode(),
									i,
								),
							);
						} else {
							throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, {
								itemIndex: i,
							});
						}
						break;

					case 'comparison': {
						const version1 = this.getNodeParameter('version1', i) as string;
						const version2 = this.getNodeParameter('version2', i) as string;

						switch (operation) {
							case 'gt':
								json = toOutputJson(semver.gt(version1, version2, options));
								break;
							case 'gte':
								json = toOutputJson(semver.gte(version1, version2, options));
								break;
							case 'lt':
								json = toOutputJson(semver.lt(version1, version2, options));
								break;
							case 'lte':
								json = toOutputJson(semver.lte(version1, version2, options));
								break;
							case 'eq':
								json = toOutputJson(semver.eq(version1, version2, options));
								break;
							case 'neq':
								json = toOutputJson(semver.neq(version1, version2, options));
								break;
							case 'compare':
								json = toOutputJson(semver.compare(version1, version2, options));
								break;
							case 'rcompare':
								json = toOutputJson(semver.rcompare(version1, version2, options));
								break;
							case 'compareBuild':
								json = toOutputJson(semver.compareBuild(version1, version2, options));
								break;
							case 'compareLoose':
								json = toOutputJson(semver.compareLoose(version1, version2));
								break;
							case 'diff':
								// 版本相等时 diff 为 null，属于有效结果
								json = toOutputJson(semver.diff(version1, version2));
								break;
							default:
								throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, {
									itemIndex: i,
								});
						}
						break;
					}

					case 'range':
						switch (operation) {
							case 'satisfies': {
								const version = this.getNodeParameter('version', i) as string;
								const range = this.getNodeParameter('range', i) as string;
								json = toOutputJson(semver.satisfies(version, range, options));
								break;
							}
							case 'validRange': {
								const range = this.getNodeParameter('range', i) as string;
								json = toOutputJson(semver.validRange(range, options) !== null);
								break;
							}
							case 'maxSatisfying': {
								const versionsStr = this.getNodeParameter('versions', i) as string;
								const range = this.getNodeParameter('range', i) as string;
								const versions = versionsStr.split(',').map((v) => v.trim());
								json = toOutputJson(
									requireValue(
										semver.maxSatisfying(versions, range, options),
										`No version satisfies range: ${range}`,
										this.getNode(),
										i,
									),
								);
								break;
							}
							case 'minSatisfying': {
								const versionsStr = this.getNodeParameter('versions', i) as string;
								const range = this.getNodeParameter('range', i) as string;
								const versions = versionsStr.split(',').map((v) => v.trim());
								json = toOutputJson(
									requireValue(
										semver.minSatisfying(versions, range, options),
										`No version satisfies range: ${range}`,
										this.getNode(),
										i,
									),
								);
								break;
							}
							case 'minVersion': {
								const range = this.getNodeParameter('range', i) as string;
								json = toOutputJson(
									requireValue(
										toPlainSemVer(semver.minVersion(range, options)),
										`Invalid range: ${range}`,
										this.getNode(),
										i,
									),
								);
								break;
							}
							case 'gtr': {
								const version = this.getNodeParameter('version', i) as string;
								const range = this.getNodeParameter('range', i) as string;
								json = toOutputJson(semver.gtr(version, range, options));
								break;
							}
							case 'ltr': {
								const version = this.getNodeParameter('version', i) as string;
								const range = this.getNodeParameter('range', i) as string;
								json = toOutputJson(semver.ltr(version, range, options));
								break;
							}
							case 'outside': {
								const version = this.getNodeParameter('version', i) as string;
								const range = this.getNodeParameter('range', i) as string;
								const hilo = this.getNodeParameter('hilo', i) as '>' | '<';
								json = toOutputJson(semver.outside(version, range, hilo, options));
								break;
							}
							case 'intersects': {
								const range1 = this.getNodeParameter('range1', i) as string;
								const range2 = this.getNodeParameter('range2', i) as string;
								json = toOutputJson(semver.intersects(range1, range2, options));
								break;
							}
							case 'simplifyRange': {
								const versionsStr = this.getNodeParameter('versions', i) as string;
								const range = this.getNodeParameter('range', i) as string;
								const versions = versionsStr.split(',').map((v) => v.trim());
								json = toOutputJson(semver.simplifyRange(versions, range, options));
								break;
							}
							case 'subset': {
								const range1 = this.getNodeParameter('range1', i) as string;
								const range2 = this.getNodeParameter('range2', i) as string;
								json = toOutputJson(semver.subset(range1, range2, options));
								break;
							}
							case 'toComparators': {
								const range = this.getNodeParameter('range', i) as string;
								json = toOutputJson(semver.toComparators(range, options));
								break;
							}
							default:
								throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, {
									itemIndex: i,
								});
						}
						break;

					case 'increment': {
						const version = this.getNodeParameter('version', i) as string;
						const releaseType = this.getNodeParameter('releaseType', i) as semver.ReleaseType;
						const identifier = this.getNodeParameter('identifier', i, '') as string;
						const identifierBase = this.getNodeParameter('identifierBase', i, '0') as string;

						let newVersion: string | null;
						if (identifier && identifierBase === 'false') {
							newVersion = semver.inc(version, releaseType, identifier, false);
						} else if (identifier) {
							newVersion = semver.inc(version, releaseType, identifier);
						} else {
							newVersion = semver.inc(version, releaseType);
						}

						json = toOutputJson(
							requireValue(
								newVersion,
								`Invalid version: ${version}`,
								this.getNode(),
								i,
							),
						);
						break;
					}

					case 'parsing': {
						const version = this.getNodeParameter('version', i) as string;

						switch (operation) {
							case 'parse': {
								const parsed = requireValue(
									toPlainSemVer(semver.parse(version, options)),
									`Invalid version: ${version}`,
									this.getNode(),
									i,
								);
								json = toOutputJson(parsed);
								break;
							}
							case 'major':
								json = toOutputJson(semver.major(version, options));
								break;
							case 'minor':
								json = toOutputJson(semver.minor(version, options));
								break;
							case 'patch':
								json = toOutputJson(semver.patch(version, options));
								break;
							case 'prerelease': {
								// 版本不合法时报错；合法但无预发布信息时返回空数组
								requireValue(
									semver.parse(version, options),
									`Invalid version: ${version}`,
									this.getNode(),
									i,
								);
								json = toOutputJson(semver.prerelease(version, options) ?? []);
								break;
							}
							default:
								throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, {
									itemIndex: i,
								});
						}
						break;
					}

					case 'cleaning': {
						const version = this.getNodeParameter('version', i) as string;
						json = toOutputJson(
							requireValue(
								semver.clean(version, options),
								`Invalid version: ${version}`,
								this.getNode(),
								i,
							),
						);
						break;
					}

					case 'coercion': {
						const version = this.getNodeParameter('version', i) as string;
						json = toOutputJson(
							requireValue(
								toPlainSemVer(semver.coerce(version, options)),
								`Unable to coerce version: ${version}`,
								this.getNode(),
								i,
							),
						);
						break;
					}

					case 'sorting': {
						const versionsStr = this.getNodeParameter('versions', i) as string;
						const versions = versionsStr.split(',').map((v) => v.trim());

						switch (operation) {
							case 'sort':
								json = toOutputJson(semver.sort([...versions], options));
								break;
							case 'rsort':
								json = toOutputJson(semver.rsort([...versions], options));
								break;
							default:
								throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, {
									itemIndex: i,
								});
						}
						break;
					}

					default:
						throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`, {
							itemIndex: i,
						});
				}

				returnData.push({
					json,
					pairedItem: { item: i },
				});
			} catch (error) {
				const nodeError =
					error instanceof NodeOperationError
						? error
						: new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });

				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: nodeError.message,
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw nodeError;
			}
		}

		return [returnData];
	}
}
